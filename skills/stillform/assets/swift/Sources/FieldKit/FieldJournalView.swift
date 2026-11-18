import SwiftUI

public struct FieldJournalView: View {
    @State private var journal: Journal
    @State private var query = ""
    @State private var pinnedOnly = false
    @State private var selection: Entry.ID?
    @State private var editing: Entry?
    private let onChange: (Journal) -> Void

    public init(journal: Journal = .sample, onChange: @escaping (Journal) -> Void = { _ in }) {
        _journal = State(initialValue: journal)
        #if os(macOS)
        _selection = State(initialValue: journal.entries.first?.id)
        #endif
        self.onChange = onChange
    }

    private var visibleEntries: [Entry] { journal.matching(query, pinnedOnly: pinnedOnly) }
    private var selectedEntry: Entry? { visibleEntries.first { $0.id == selection } }

    public var body: some View {
        NavigationSplitView {
            List(selection: $selection) {
                ForEach(visibleEntries) { entry in
                    NavigationLink(value: entry.id) {
                        HStack {
                            Text(entry.title)
                            if entry.pinned {
                                Image(systemName: "pin.fill")
                                    .accessibilityLabel("Pinned")
                            }
                        }
                    }
                }
            }
            .overlay {
                if visibleEntries.isEmpty {
                    ContentUnavailableView {
                        Label("No matching notes", systemImage: "magnifyingglass")
                    } actions: {
                        Button("Show all notes") { query = ""; pinnedOnly = false }
                    }
                }
            }
            .navigationTitle("Field journal")
            .searchable(text: $query, prompt: "Search notes")
            .toolbar {
                ToolbarItem {
                    Menu {
                        Toggle("Pinned only", isOn: $pinnedOnly)
                    } label: {
                        Label("Filter notes", systemImage: "line.3.horizontal.decrease.circle")
                    }
                }
                ToolbarItem {
                    Button { editing = Entry(title: "") } label: {
                        Label("Add note", systemImage: "plus")
                    }
                    .keyboardShortcut("n", modifiers: .command)
                }
            }
        } detail: {
            if let selectedEntry {
                VStack(alignment: .leading, spacing: 16) {
                    if selectedEntry.pinned { Label("Pinned", systemImage: "pin").foregroundStyle(.secondary) }
                    Text(selectedEntry.title).font(.title).accessibilityAddTraits(.isHeader)
                    Button("Edit note") { editing = selectedEntry }
                }
                .frame(maxWidth: .infinity, maxHeight: .infinity, alignment: .topLeading)
                .padding()
                .navigationTitle("Field note")
            } else {
                ContentUnavailableView("Choose a note", systemImage: "book.closed", description: Text("Select a field note to read or edit it."))
            }
        }
        .sheet(item: $editing) { original in
            EntryEditor(original: original) { draft in
                if journal.save(draft) {
                    query = ""
                    if !draft.pinned { pinnedOnly = false }
                    selection = draft.id
                    onChange(journal)
                }
            }
        }
    }
}

private struct EntryEditor: View {
    @Environment(\.dismiss) private var dismiss
    @State private var draft: Entry
    @State private var confirmDiscard = false
    private let original: Entry
    private let save: (Entry) -> Void

    init(original: Entry, save: @escaping (Entry) -> Void) {
        self.original = original
        self.save = save
        _draft = State(initialValue: original)
    }

    var body: some View {
        NavigationStack {
            Form {
                TextField("Title", text: $draft.title, axis: .vertical)
                Toggle("Pin this note", isOn: $draft.pinned)
            }
            .formStyle(.grouped)
            .navigationTitle(original.title.isEmpty ? "New note" : "Edit note")
            .toolbar {
                ToolbarItem(placement: .cancellationAction) {
                    Button("Cancel") {
                        if draft == original { dismiss() } else { confirmDiscard = true }
                    }
                }
                ToolbarItem(placement: .confirmationAction) {
                    Button("Save") { save(draft); dismiss() }
                        .disabled(draft.title.trimmingCharacters(in: .whitespacesAndNewlines).isEmpty)
                }
            }
        }
        .interactiveDismissDisabled(draft != original)
        .confirmationDialog("Discard changes?", isPresented: $confirmDiscard, titleVisibility: .visible) {
            Button("Discard changes", role: .destructive) { dismiss() }
            Button("Keep editing", role: .cancel) {}
        }
        #if os(macOS)
        .frame(minWidth: 320, minHeight: 220)
        #endif
    }
}

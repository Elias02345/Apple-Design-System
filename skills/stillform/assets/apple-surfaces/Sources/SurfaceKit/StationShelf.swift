#if os(tvOS)
import SwiftUI

/// Remote focus previews an available action. Selection changes the station.
public struct StationShelf: View {
    @FocusState private var focused: Station?
    @State private var selected = Station.northInlet
    public init() {}
    public var body: some View {
        VStack(alignment: .leading, spacing: 32) {
            Text("Coastal stations").font(.largeTitle)
            HStack(spacing: 36) {
                ForEach(Station.allCases) { station in
                    Button { selected = station } label: {
                        VStack(alignment: .leading, spacing: 12) {
                            Image(systemName: selected == station ? "checkmark.circle.fill" : "water.waves")
                            Text(station.rawValue)
                        }.padding(24)
                    }
                    .buttonStyle(.card)
                    .focused($focused, equals: station)
                    .accessibilityAddTraits(selected == station ? .isSelected : [])
                }
            }
            Divider()
            Text(selected.rawValue).font(.headline)
            Text(selected.reading(at: 8)).font(.system(.largeTitle, design: .rounded)).monospacedDigit()
            Text("Modelled water level at 08:00").foregroundStyle(.secondary)
        }
        .padding(60)
        .onAppear { focused = selected }
    }
}
#endif

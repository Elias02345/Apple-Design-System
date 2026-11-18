import 'package:flutter/material.dart';
import 'cue.dart';
import 'controls.dart';

class CueDesk extends StatefulWidget {
  const CueDesk({super.key, required this.initialCues, required this.durationSeconds, required this.onCommit});
  final List<Cue> initialCues;
  final int durationSeconds;
  final Future<void> Function(Cue) onCommit;
  @override
  State<CueDesk> createState() => _CueDeskState();
}

class _CueDeskState extends State<CueDesk> {
  late final cues = List<Cue>.of(widget.initialCues);
  late final title = TextEditingController(text: cues.firstOrNull?.title ?? '');
  late bool review = cues.firstOrNull?.review ?? false;
  final titleFocus = FocusNode();
  final actionFocus = FocusNode();
  final editorKey = GlobalKey();
  int selected = 0;
  int? pending;
  String? error;
  String status = '';
  bool saving = false;
  bool get dirty => title.text != cues[selected].title || review != cues[selected].review;

  @override
  void dispose() {
    title.dispose();
    titleFocus.dispose();
    actionFocus.dispose();
    super.dispose();
  }

  void revealEditor() {
    WidgetsBinding.instance.addPostFrameCallback((_) {
      if (!mounted) return;
      final detail = editorKey.currentContext;
      if (detail != null) Scrollable.ensureVisible(detail, alignmentPolicy: ScrollPositionAlignmentPolicy.keepVisibleAtEnd);
    });
  }

  void open(int index) {
    setState(() {
      selected = index;
      title.text = cues[index].title;
      review = cues[index].review;
      pending = null;
      error = null;
      status = '';
    });
    revealEditor();
  }

  void choose(String id) {
    final index = cues.indexWhere((cue) => cue.id == id);
    if (index == selected || saving || index < 0) return;
    if (!dirty) { open(index); return; }
    setState(() => pending = index);
    revealEditor();
    WidgetsBinding.instance.addPostFrameCallback((_) { if (mounted && pending != null) actionFocus.requestFocus(); });
  }

  Future<void> save() async {
    if (saving || !dirty) return;
    if (title.text.trim().isEmpty) {
      setState(() { error = 'Enter a cue name.'; status = ''; });
      titleFocus.requestFocus();
      return;
    }
    final edited = cues[selected].edit(title.text, review);
    setState(() { saving = true; error = null; status = ''; });
    try {
      await widget.onCommit(edited);
      if (!mounted) return;
      setState(() { cues[selected] = edited; title.text = edited.title; status = 'Changes saved.'; });
    } catch (_) {
      if (mounted) setState(() => status = 'Save failed. Your draft is ready to retry.');
    } finally {
      if (mounted) setState(() => saving = false);
    }
  }

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    if (cues.isEmpty) return const Center(child: Text('No cues in this session.'));
    final current = cues[selected];
    final guard = pending;
    return SingleChildScrollView(child: Center(child: ConstrainedBox(
      constraints: const BoxConstraints(maxWidth: 980),
      child: Padding(padding: const EdgeInsets.all(24), child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch, children: [
          Text('Field recording', style: theme.textTheme.labelLarge),
          const SizedBox(height: 6),
          Text('Listening desk', style: theme.textTheme.displaySmall?.copyWith(fontWeight: FontWeight.w600)),
          CueStrip(cues: cues, selected: current.id, duration: widget.durationSeconds),
          const SizedBox(height: 20),
          AdaptivePanes(list: Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
            Text('Cue sheet', style: theme.textTheme.titleMedium), const SizedBox(height: 8),
            CueList(cues: cues, selected: current.id, onSelect: saving || guard != null ? null : choose),
          ]), detail: Container(key: editorKey, padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(color: theme.colorScheme.surfaceContainerLow,
              borderRadius: BorderRadius.circular(14)),
            child: guard != null ? Column(crossAxisAlignment: CrossAxisAlignment.start, children: [
              Text('Discard changes to ' + current.title + '?', style: theme.textTheme.titleLarge),
              const SizedBox(height: 8),
              Text('Opening ' + cues[guard].title + ' will replace this draft.'),
              const SizedBox(height: 16),
              Wrap(spacing: 8, children: [
                FilledButton(focusNode: actionFocus, onPressed: () {
                  setState(() => pending = null);
                  titleFocus.requestFocus();
                }, child: const Text('Keep editing')),
                TextButton(onPressed: () => open(guard), child: const Text('Discard and open')),
              ]),
            ]) : Column(crossAxisAlignment: CrossAxisAlignment.stretch, children: [
              Text(current.time, textDirection: TextDirection.ltr,
                style: theme.textTheme.headlineMedium?.copyWith(fontFamily: 'monospace')),
              const SizedBox(height: 12),
              TextField(controller: title, focusNode: titleFocus, enabled: !saving,
                decoration: InputDecoration(labelText: 'Cue name', errorText: error,
                  border: const OutlineInputBorder()),
                onChanged: (_) => setState(() { error = null; status = ''; })),
              SwitchListTile.adaptive(contentPadding: EdgeInsets.zero, title: const Text('Mark for review'),
                value: review, onChanged: saving ? null : (v) => setState(() { review = v; status = ''; })),
              EditorActions(onSave: dirty && !saving ? save : null, saving: saving,
                onRevert: dirty && !saving ? () { open(selected); titleFocus.requestFocus(); } : null),
              if (status.isNotEmpty) Padding(padding: const EdgeInsets.only(top: 12),
                child: Semantics(liveRegion: true, child: Text(status))),
            ]))),
        ])))));
  }
}

import 'package:flutter/material.dart';
import 'cue.dart';

/// Stacks the same keyed children in reading order when space or large type demands it.
class AdaptivePanes extends StatelessWidget {
  const AdaptivePanes({super.key, required this.list, required this.detail});
  final Widget list;
  final Widget detail;

  @override
  Widget build(BuildContext context) => LayoutBuilder(builder: (context, size) {
    final scaled = MediaQuery.textScalerOf(context).scale(16) / 16;
    if (size.maxWidth < 680 * scaled) {
      return Column(crossAxisAlignment: CrossAxisAlignment.stretch,
          children: [list, const SizedBox(height: 24), detail]);
    }
    return Row(crossAxisAlignment: CrossAxisAlignment.start, children: [
      Expanded(flex: 4, child: list), const SizedBox(width: 32),
      Expanded(flex: 5, child: detail),
    ]);
  });
}

/// A controlled selection. The parent owns the current ID and any dismissal policy.
class CueList extends StatelessWidget {
  const CueList({super.key, required this.cues, required this.selected,
    required this.onSelect});
  final List<Cue> cues;
  final String selected;
  final ValueChanged<String>? onSelect;

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return Column(children: [
      for (final cue in cues)
        ListTile(
          key: ValueKey(cue.id),
          selected: cue.id == selected,
          selectedTileColor: theme.colorScheme.secondaryContainer,
          selectedColor: theme.colorScheme.onSecondaryContainer,
          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(8)),
          leading: Text(cue.time, style: const TextStyle(fontFamily: 'monospace')),
          title: Text(cue.title),
          subtitle: cue.review ? const Text('For review') : null,
          onTap: onSelect == null ? null : () => onSelect!(cue.id),
        ),
    ]);
  }
}

/// Positions source cues in time. Every marker also has a text equivalent in CueList.
class CueStrip extends StatelessWidget {
  const CueStrip({super.key, required this.cues, required this.selected, required this.duration});
  final List<Cue> cues;
  final String selected;
  final int duration;

  @override
  Widget build(BuildContext context) {
    final disabled = MediaQuery.disableAnimationsOf(context) ||
        View.of(context).platformDispatcher.accessibilityFeatures.reduceMotion;
    final color = Theme.of(context).colorScheme;
    return ExcludeSemantics(child: SizedBox(height: 48, child: LayoutBuilder(builder: (context, size) {
      final width = (size.maxWidth - 10).clamp(0.0, double.infinity).toDouble();
      return Stack(children: [
        Positioned(left: 0, right: 0, bottom: 6, child: Divider(height: 1, color: color.outline)),
        for (final cue in cues)
          Positioned(left: width * (cue.seconds / duration.clamp(1, 1 << 30)).clamp(0.0, 1.0),
            bottom: 6, child: AnimatedContainer(key: ValueKey('mark-' + cue.id),
              duration: disabled ? Duration.zero : const Duration(milliseconds: 140),
              width: cue.id == selected ? 8 : 3, height: cue.id == selected ? 34 : 19,
              color: cue.id == selected ? color.primary : color.outline)),
      ]);
    })));
  }
}

/// Buttons remain separate targets when translated labels or large text require wrapping.
class EditorActions extends StatelessWidget {
  const EditorActions({super.key, required this.onSave, required this.onRevert, this.saving = false});
  final VoidCallback? onSave;
  final VoidCallback? onRevert;
  final bool saving;
  @override
  Widget build(BuildContext context) => Wrap(spacing: 8, runSpacing: 4, children: [
    FilledButton(onPressed: onSave, child: Text(saving ? 'Saving…' : 'Save changes')),
    TextButton(onPressed: onRevert, child: const Text('Revert')),
  ]);
}

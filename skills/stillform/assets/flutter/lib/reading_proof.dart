import 'package:flutter/material.dart';

/// A controlled value with drag, keyboard, and exact one-step alternatives.
class PrecisionField extends StatelessWidget {
  const PrecisionField({
    super.key,
    required this.label,
    required this.value,
    required this.min,
    required this.max,
    required this.onChanged,
  });
  final String label;
  final int value, min, max;
  final ValueChanged<int> onChanged;
  @override
  Widget build(BuildContext context) => Column(
    crossAxisAlignment: CrossAxisAlignment.start,
    children: [
      Text(label + ' · ' + value.toString()),
      Row(
        children: [
          IconButton(
            tooltip: 'Decrease ' + label.toLowerCase(),
            icon: const Icon(Icons.remove),
            onPressed: value > min ? () => onChanged(value - 1) : null,
          ),
          Expanded(
            child: Semantics(
              label: label,
              child: Slider(
                min: min.toDouble(),
                max: max.toDouble(),
                divisions: max - min,
                value: value.toDouble(),
                semanticFormatterCallback: (v) => v.round().toString(),
                onChanged: (v) => onChanged(v.round()),
              ),
            ),
          ),
          IconButton(
            tooltip: 'Increase ' + label.toLowerCase(),
            icon: const Icon(Icons.add),
            onPressed: value < max ? () => onChanged(value + 1) : null,
          ),
        ],
      ),
    ],
  );
}

class ReadingProof extends StatefulWidget {
  const ReadingProof({super.key});
  @override
  State<ReadingProof> createState() => _ReadingProofState();
}

class _ReadingProofState extends State<ReadingProof> {
  static const defaults = (size: 20, open: false);
  var style = defaults;
  ({int size, bool open})? previous;
  String status = '';
  void change(({int size, bool open}) next) => setState(() {
    style = next;
    previous = null;
    status = '';
  });

  @override
  Widget build(BuildContext context) {
    final theme = Theme.of(context);
    return ListView(
      padding: const EdgeInsets.all(24),
      children: [
        Center(
          child: ConstrainedBox(
            constraints: const BoxConstraints(maxWidth: 680),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.stretch,
              children: [
                Text('Reading proof', style: theme.textTheme.displaySmall),
                const SizedBox(height: 20),
                DecoratedBox(
                  decoration: BoxDecoration(
                    border: BorderDirectional(
                      start: BorderSide(
                        color: theme.colorScheme.primary,
                        width: 3,
                      ),
                    ),
                  ),
                  child: Padding(
                    padding: const EdgeInsetsDirectional.only(start: 18),
                    child: Text(
                      'At low tide the old footpath surfaces again. Walk it slowly and the stones begin to tell you where the water goes.',
                      style: TextStyle(
                        fontFamily: 'serif',
                        fontSize: style.size.toDouble(),
                        height: style.open ? 1.75 : 1.35,
                      ),
                    ),
                  ),
                ),
                const Divider(height: 42),
                PrecisionField(
                  label: 'Type size',
                  value: style.size,
                  min: 16,
                  max: 36,
                  onChanged: (v) => change((size: v, open: style.open)),
                ),
                SwitchListTile.adaptive(
                  contentPadding: EdgeInsets.zero,
                  title: const Text('Open line spacing'),
                  value: style.open,
                  onChanged: (v) => change((size: style.size, open: v)),
                ),
                Wrap(
                  spacing: 8,
                  children: [
                    OutlinedButton(
                      onPressed: style == defaults
                          ? null
                          : () => setState(() {
                              previous = style;
                              style = defaults;
                              status = 'Reading settings reset.';
                            }),
                      child: const Text('Reset settings'),
                    ),
                    if (previous != null)
                      TextButton(
                        onPressed: () => setState(() {
                          style = previous!;
                          previous = null;
                          status = 'Reading settings restored.';
                        }),
                        child: const Text('Undo reset'),
                      ),
                  ],
                ),
                if (status.isNotEmpty)
                  Semantics(liveRegion: true, child: Text(status)),
              ],
            ),
          ),
        ),
      ],
    );
  }
}

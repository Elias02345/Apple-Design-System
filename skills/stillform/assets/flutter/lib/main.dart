import 'package:flutter/material.dart';
import 'cue.dart';
import 'cue_desk.dart';

void main() => runApp(const ListeningDesk());

class ListeningDesk extends StatefulWidget {
  const ListeningDesk({super.key});
  @override
  State<ListeningDesk> createState() => _ListeningDeskState();
}

class _ListeningDeskState extends State<ListeningDesk> {
  final session = {for (final cue in listeningSession) cue.id: cue};
  ThemeData theme(Brightness brightness) => ThemeData(useMaterial3: true,
    colorScheme: ColorScheme.fromSeed(seedColor: const Color(0xff326756), brightness: brightness));
  @override
  Widget build(BuildContext context) => MaterialApp(title: 'Listening desk',
    debugShowCheckedModeBanner: false, theme: theme(Brightness.light), darkTheme: theme(Brightness.dark),
    home: Scaffold(body: SafeArea(child: CueDesk(initialCues: session.values.toList(), durationSeconds: 120,
      onCommit: (cue) async { session[cue.id] = cue; }))));
}

import 'dart:async';
import 'package:flutter/material.dart';
import 'package:flutter_test/flutter_test.dart';
import 'package:stillform_cues/controls.dart';
import 'package:stillform_cues/cue.dart';
import 'package:stillform_cues/cue_desk.dart';
import 'package:stillform_cues/reading_proof.dart';

Future<void> mount(
  WidgetTester t,
  Future<void> Function(Cue) commit, {
  double scale = 1,
  bool reduced = false,
  List<Cue> cues = listeningSession,
}) async {
  await t.pumpWidget(
    MaterialApp(
      home: Scaffold(
        body: Builder(
          builder: (context) => MediaQuery(
            data: MediaQuery.of(context).copyWith(
              textScaler: TextScaler.linear(scale),
              disableAnimations: reduced,
            ),
            child: CueDesk(
              initialCues: cues,
              durationSeconds: 120,
              onCommit: commit,
            ),
          ),
        ),
      ),
    ),
  );
}

Future<void> activate(WidgetTester t, Finder finder) async {
  await t.pump();
  await t.ensureVisible(finder);
  await t.tap(finder);
  await t.pumpAndSettle();
}

void main() {
  testWidgets(
    'precision controls, reset and undo restore both reading settings',
    (t) async {
      await t.pumpWidget(
        const MaterialApp(home: Scaffold(body: ReadingProof())),
      );
      await activate(t, find.byTooltip('Increase type size'));
      await activate(t, find.text('Open line spacing'));
      await activate(t, find.text('Reset settings'));
      expect(find.text('Type size · 20'), findsOneWidget);
      await activate(t, find.text('Undo reset'));
      expect(find.text('Type size · 21'), findsOneWidget);
      expect(
        t.widget<SwitchListTile>(find.byType(SwitchListTile)).value,
        isTrue,
      );
    },
  );
  testWidgets('empty session has a completion state', (t) async {
    await mount(t, (_) async {}, cues: []);
    expect(find.text('No cues in this session.'), findsOneWidget);
  });
  testWidgets(
    'validation, failed persistence and retry preserve the draft and identity',
    (t) async {
      var attempts = 0;
      Cue? saved;
      await mount(t, (cue) async {
        if (++attempts == 1) throw StateError('offline');
        saved = cue;
      });
      final input = find.byType(TextField);
      await t.enterText(input, '  ');
      await activate(t, find.text('Save changes'));
      expect(find.text('Enter a cue name.'), findsOneWidget);
      expect(attempts, 0);
      await t.enterText(input, '  Arrival  ');
      await activate(t, find.text('Save changes'));
      expect(
        find.text('Save failed. Your draft is ready to retry.'),
        findsOneWidget,
      );
      expect(t.widget<TextField>(input).controller!.text, '  Arrival  ');
      await activate(t, find.text('Save changes'));
      expect(saved?.id, 'room');
      expect(saved?.title, 'Arrival');
      expect(find.text('Changes saved.'), findsOneWidget);
    },
  );
  testWidgets(
    'changing selection protects a dirty draft and restores field focus',
    (t) async {
      await mount(t, (_) async {});
      await t.enterText(find.byType(TextField), 'New draft');
      await activate(t, find.text('Door closes'));
      expect(find.text('Discard changes to Room tone?'), findsOneWidget);
      await activate(t, find.text('Keep editing'));
      final field = t.widget<TextField>(find.byType(TextField));
      expect(field.controller!.text, 'New draft');
      expect(field.focusNode!.hasFocus, isTrue);
      await activate(t, find.text('Door closes'));
      await activate(t, find.text('Discard and open'));
      expect(
        t.widget<TextField>(find.byType(TextField)).controller!.text,
        'Door closes',
      );
    },
  );
  testWidgets('pending save disables double submission and freezes selection', (
    t,
  ) async {
    final finish = Completer<void>();
    var calls = 0;
    await mount(t, (_) {
      calls++;
      return finish.future;
    });
    await t.enterText(find.byType(TextField), 'After rain');
    await activate(t, find.text('Save changes'));
    expect(
      t
          .widget<FilledButton>(find.widgetWithText(FilledButton, 'Saving…'))
          .onPressed,
      isNull,
    );
    expect(t.widget<CueList>(find.byType(CueList)).onSelect, isNull);
    finish.complete();
    await t.pumpAndSettle();
    expect(calls, 1);
    expect(find.text('Changes saved.'), findsOneWidget);
  });
  testWidgets(
    'compact large type reflows and the selected marker honors reduced motion',
    (t) async {
      t.view.devicePixelRatio = 1;
      t.view.physicalSize = const Size(360, 800);
      addTearDown(t.view.resetPhysicalSize);
      addTearDown(t.view.resetDevicePixelRatio);
      await mount(t, (_) async {}, scale: 2, reduced: true);
      await activate(t, find.text('Footsteps on stone'));
      final marker = t.widget<AnimatedContainer>(
        find.byKey(const ValueKey('mark-steps')),
      );
      expect(marker.duration, Duration.zero);
      expect(
        t.widget<TextField>(find.byType(TextField)).controller!.text,
        'Footsteps on stone',
      );
      expect(t.takeException(), isNull);
    },
  );
}

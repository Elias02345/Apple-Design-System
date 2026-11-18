class Cue {
  const Cue(this.id, this.seconds, this.title, {this.review = false});
  final String id;
  final int seconds;
  final String title;
  final bool review;

  Cue edit(String title, bool review) =>
      Cue(id, seconds, title.trim(), review: review);
  String get time =>
      (seconds ~/ 60).toString().padLeft(2, '0') +
      ':' +
      (seconds % 60).toString().padLeft(2, '0');
}

const listeningSession = [
  Cue('room', 8, 'Room tone'),
  Cue('door', 46, 'Door closes', review: true),
  Cue('steps', 93, 'Footsteps on stone'),
];

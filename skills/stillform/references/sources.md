# Research and attribution

Begin with the official topic for the surface or decision in question. The bundled [catalog](catalog.json) indexes titles and canonical links from the English design hub, its reachable HIG topics, linked design sessions, resource pages and developer stories collected for this release. HIG entries also include their discoverable image and clip variant URLs. For an exact API signature, check its framework documentation and deployment availability.

From the skill folder:

```sh
python scripts/lookup.py "buttons" --kind guideline --media
python scripts/lookup.py "liquid glass" --kind video
python scripts/lookup.py "design resources" --kind resource
python scripts/lookup.py "watchos" --limit 12
```

| Question | Primary source |
| --- | --- |
| Which principle resolves this trade-off? | [Design principles](https://developer.apple.com/design/human-interface-guidelines/design-principles) |
| What is different on this platform? | [Getting started](https://developer.apple.com/design/human-interface-guidelines/getting-started) |
| What changes for assistive technology or larger type? | [Accessibility](https://developer.apple.com/design/human-interface-guidelines/accessibility), [VoiceOver](https://developer.apple.com/design/human-interface-guidelines/voiceover) |
| How do native materials and controls relate to content? | [Materials](https://developer.apple.com/design/human-interface-guidelines/materials), [Meet Liquid Glass](https://developer.apple.com/videos/play/wwdc2025/219/) |
| Where are official design files and font downloads? | [Apple Design Resources](https://developer.apple.com/design/resources/), [Fonts](https://developer.apple.com/fonts/), [SF Symbols](https://developer.apple.com/sf-symbols/) |
| Which talks show the principles in practice? | [Design foundations from idea to interface](https://developer.apple.com/videos/play/wwdc2025/359/), [Design sessions](https://developer.apple.com/videos/design/) |

Stillform is an independent implementation guide. Its text, examples, token values, generated specimen artwork and interface recordings were created for this project. Apple retains its rights in its documentation, downloadable kits, photographs, videos, typefaces, symbols and marks. Use the applicable terms at the official download destination. The author's research copies are separate from this MIT-licensed distribution. [Apple Developer Design](https://developer.apple.com/design/)

#if os(watchOS)
import SwiftUI

/// A glanceable modelled reading with Crown adjustment and a touch alternative.
public struct WristReading: View {
    @State private var hour = 8.0
    public init() {}
    public var body: some View {
        ScrollView {
            VStack(alignment: .leading) {
                Text(Station.northInlet.rawValue).font(.headline)
                Text(Station.northInlet.reading(at: Int(hour)))
                    .font(.title).monospacedDigit()
                    .accessibilityLabel("Modelled height")
                    .accessibilityValue(Station.northInlet.reading(at: Int(hour)))
                Text(String(format: "%02d:00", Int(hour))).monospacedDigit()
                HStack {
                    Button { hour = max(0, hour - 1) } label: { Image(systemName: "minus") }
                        .accessibilityLabel("Previous hour").disabled(hour <= 0)
                    Button { hour = min(23, hour + 1) } label: { Image(systemName: "plus") }
                        .accessibilityLabel("Next hour").disabled(hour >= 23)
                }
            }.padding(.horizontal)
        }
        .focusable()
        .digitalCrownRotation($hour, from: 0, through: 23, by: 1, sensitivity: .medium, isContinuous: false, isHapticFeedbackEnabled: true)
    }
}
#endif

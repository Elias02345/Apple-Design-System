import SwiftUI

/// A direct-manipulation control paired with an alternative button input.
public struct ReadingGauge: View {
    @Environment(\.accessibilityReduceMotion) private var reduceMotion
    @State private var reading = 3.0
    public init() {}
    public var body: some View {
        VStack(alignment: .leading, spacing: 16) {
            Text("Exposure").font(.headline)
            Gauge(value: reading, in: 0...6) {
                Text("Exposure level")
            } currentValueLabel: { Text(reading, format: .number.precision(.fractionLength(0))) }
            Slider(value: $reading, in: 0...6, step: 1) { Text("Exposure level") }
            Stepper("Exposure \(Int(reading)) of 6", value: $reading, in: 0...6, step: 1)
            Button("Reset exposure") {
                withAnimation(reduceMotion ? nil : .easeOut(duration: 0.2)) { reading = 3 }
            }
            .disabled(reading == 3)
        }.padding()
    }
}

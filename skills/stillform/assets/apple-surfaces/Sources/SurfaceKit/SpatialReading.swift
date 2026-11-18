#if os(visionOS)
import SwiftUI

/// Present inside the host's WindowGroup. The reading task fits in a standard window.
public struct SpatialReading: View {
    @State private var station = Station.northInlet
    @State private var hour = 8
    public init() {}
    public var body: some View {
        NavigationStack {
            VStack(alignment: .leading, spacing: 24) {
                Picker("Station", selection: $station) {
                    ForEach(Station.allCases) { Text($0.rawValue).tag($0) }
                }
                Text(station.reading(at: hour))
                    .font(.system(.largeTitle, design: .rounded)).monospacedDigit()
                    .accessibilityLabel("Modelled height")
                    .accessibilityValue(station.reading(at: hour))
                Stepper(value: $hour, in: 0...23) {
                    Text("Reading time " + String(format: "%02d:00", hour))
                }
                Text("Illustrative water levels for one day.").foregroundStyle(.secondary)
            }
            .padding(32)
            .navigationTitle("Coastal observations")
        }
    }
}
#endif

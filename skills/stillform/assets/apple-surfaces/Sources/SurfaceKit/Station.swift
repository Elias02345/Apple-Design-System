import Foundation

public enum Station: String, CaseIterable, Identifiable {
    case northInlet = "North inlet"
    case westPier = "West pier"
    case eastMarsh = "East marsh"

    public var id: Self { self }

    public func height(at hour: Int) -> Double {
        let phase: Double
        switch self {
        case .northInlet: phase = 0
        case .westPier: phase = 2.3
        case .eastMarsh: phase = 3.5
        }
        let time = Double(min(23, max(0, hour))) + phase
        return 1.8 + sin(time * .pi / 6.1) + 0.24 * cos(time * .pi / 4)
    }

    public func reading(at hour: Int) -> String {
        Measurement(value: height(at: hour), unit: UnitLength.meters)
            .formatted(.measurement(width: .abbreviated, usage: .asProvided, numberFormatStyle: .number.precision(.fractionLength(2))))
    }
}

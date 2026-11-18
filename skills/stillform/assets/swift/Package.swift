// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "StillformNative",
    platforms: [.macOS(.v14), .iOS(.v17)],
    products: [
        .library(name: "FieldKit", targets: ["FieldKit"]),
        .executable(name: "FieldDesk", targets: ["FieldDesk"])
    ],
    targets: [
        .target(name: "FieldKit"),
        .executableTarget(name: "FieldDesk", dependencies: ["FieldKit"]),
        .testTarget(name: "FieldKitTests", dependencies: ["FieldKit"])
    ]
)

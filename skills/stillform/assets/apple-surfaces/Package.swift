// swift-tools-version: 5.9
import PackageDescription

let package = Package(
    name: "StillformSurfaces",
    platforms: [.macOS(.v14), .watchOS(.v10), .tvOS(.v17), .visionOS(.v1)],
    products: [.library(name: "SurfaceKit", targets: ["SurfaceKit"])],
    targets: [.target(name: "SurfaceKit"), .testTarget(name: "SurfaceKitTests", dependencies: ["SurfaceKit"])]
)

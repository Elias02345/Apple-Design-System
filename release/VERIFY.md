# Verify a release

The signed annotated tag identifies the release commit. Compare the fingerprint of the project signing identity with a copy you trust. The initial release key fingerprint is `SHA256:TeS1vfE131BSWQA39p9MqmH8YpWwuT1qgiNeKo5TSWE`.

```sh
git fetch --tags origin
git -c gpg.ssh.allowedSignersFile=release/allowed_signers verify-tag v1.0.0
git -c gpg.ssh.allowedSignersFile=release/allowed_signers verify-commit 'v1.0.0^{commit}'
```

The release includes the standalone skill ZIP and a SHA-256 checksum file. Download both to the same directory and run `sha256sum -c SHA256SUMS`. The signed tag records the source tree. To compare the ZIP with that source, extract the archive, check out the verified tag in a separate directory and compare its `skills/stillform` folder with the extracted `stillform` folder.

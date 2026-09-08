const PRECACHE_ENTRIES = [
  {
    "url": "./build-manifest.json",
    "revision": "3985239d9878a99e"
  },
  {
    "url": "./campaign/ep1/ep1-01-easy.level.json",
    "revision": "e2de162c018a8666"
  },
  {
    "url": "./campaign/ep1/ep1-01-hard.level.json",
    "revision": "8f9df0f17b085867"
  },
  {
    "url": "./campaign/ep1/ep1-01-medium.level.json",
    "revision": "342fe4b135bc40bb"
  },
  {
    "url": "./campaign/ep1/ep1-02-easy.level.json",
    "revision": "828dfdbf6e193c21"
  },
  {
    "url": "./campaign/ep1/ep1-02-hard.level.json",
    "revision": "7882ec2a8c020a55"
  },
  {
    "url": "./campaign/ep1/ep1-02-medium.level.json",
    "revision": "c73f41a599303ac2"
  },
  {
    "url": "./campaign/ep1/ep1-03-easy.level.json",
    "revision": "fc0cc1da142c7d70"
  },
  {
    "url": "./campaign/ep1/ep1-03-hard.level.json",
    "revision": "2fa2495e0e2a132b"
  },
  {
    "url": "./campaign/ep1/ep1-03-medium.level.json",
    "revision": "3afcd4f6e3ad366f"
  },
  {
    "url": "./campaign/ep1/ep1-04-easy.level.json",
    "revision": "3d6e7d64a8146772"
  },
  {
    "url": "./campaign/ep1/ep1-04-hard.level.json",
    "revision": "2303b999d6158f21"
  },
  {
    "url": "./campaign/ep1/ep1-04-medium.level.json",
    "revision": "a146b3050c895e4f"
  },
  {
    "url": "./campaign/ep1/ep1-05-easy.level.json",
    "revision": "8f3e58448d7f1816"
  },
  {
    "url": "./campaign/ep1/ep1-05-hard.level.json",
    "revision": "cb94dd8fadb81c6b"
  },
  {
    "url": "./campaign/ep1/ep1-05-medium.level.json",
    "revision": "6914ef9a4d648b2e"
  },
  {
    "url": "./campaign/ep1/ep1-06-easy.level.json",
    "revision": "d51d6e12e8262158"
  },
  {
    "url": "./campaign/ep1/ep1-06-hard.level.json",
    "revision": "4fb7adc73c486238"
  },
  {
    "url": "./campaign/ep1/ep1-06-medium.level.json",
    "revision": "9c84ed40df0aa82e"
  },
  {
    "url": "./campaign/ep1/ep1-07-easy.level.json",
    "revision": "93fa2b160b19d85b"
  },
  {
    "url": "./campaign/ep1/ep1-07-hard.level.json",
    "revision": "1b57aace1b4b2d83"
  },
  {
    "url": "./campaign/ep1/ep1-07-medium.level.json",
    "revision": "d7812f62aa5ff3e1"
  },
  {
    "url": "./campaign/ep1/ep1-08-easy.level.json",
    "revision": "aea707288cc0a5b8"
  },
  {
    "url": "./campaign/ep1/ep1-08-hard.level.json",
    "revision": "36bbbb89234a0d1a"
  },
  {
    "url": "./campaign/ep1/ep1-08-medium.level.json",
    "revision": "7b2bfea1ba3a678b"
  },
  {
    "url": "./campaign/ep1/ep1-09-easy.level.json",
    "revision": "ddaec7fab1b8af66"
  },
  {
    "url": "./campaign/ep1/ep1-09-hard.level.json",
    "revision": "394ac81e4d0ddc00"
  },
  {
    "url": "./campaign/ep1/ep1-09-medium.level.json",
    "revision": "e9bbe0a32b6715d1"
  },
  {
    "url": "./campaign/ep1/ep1-10-easy.level.json",
    "revision": "eccede2ef685a708"
  },
  {
    "url": "./campaign/ep1/ep1-10-hard.level.json",
    "revision": "4fad48e48afa38ae"
  },
  {
    "url": "./campaign/ep1/ep1-10-medium.level.json",
    "revision": "ba58df9d5f141f3d"
  },
  {
    "url": "./campaign/ep1/ep1-11-easy.level.json",
    "revision": "2bb4b11a1a886276"
  },
  {
    "url": "./campaign/ep1/ep1-11-hard.level.json",
    "revision": "40c6c1d0f24bc9ec"
  },
  {
    "url": "./campaign/ep1/ep1-11-medium.level.json",
    "revision": "55f6d85ffb9a41ac"
  },
  {
    "url": "./campaign/ep1/ep1-12-easy.level.json",
    "revision": "7af029e85badb6e2"
  },
  {
    "url": "./campaign/ep1/ep1-12-hard.level.json",
    "revision": "1da568df3b4549bd"
  },
  {
    "url": "./campaign/ep1/ep1-12-medium.level.json",
    "revision": "e0226df12ac5faff"
  },
  {
    "url": "./campaign/ep1/ep1-13-easy.level.json",
    "revision": "2907476c84e4c930"
  },
  {
    "url": "./campaign/ep1/ep1-13-hard.level.json",
    "revision": "3a28aecec63665e4"
  },
  {
    "url": "./campaign/ep1/ep1-13-medium.level.json",
    "revision": "ffdcfe05d83586da"
  },
  {
    "url": "./campaign/ep1/ep1-14-easy.level.json",
    "revision": "ef2a57b57149e10e"
  },
  {
    "url": "./campaign/ep1/ep1-14-hard.level.json",
    "revision": "c3f6bb02623f63f4"
  },
  {
    "url": "./campaign/ep1/ep1-14-medium.level.json",
    "revision": "e53742da0e41e24d"
  },
  {
    "url": "./campaign/ep1/ep1-15-easy.level.json",
    "revision": "d1569132d7138f62"
  },
  {
    "url": "./campaign/ep1/ep1-15-hard.level.json",
    "revision": "7707aeb79bc30aaf"
  },
  {
    "url": "./campaign/ep1/ep1-15-medium.level.json",
    "revision": "ab2bdfe6946f0514"
  },
  {
    "url": "./campaign/ep1/ep1-16-easy.level.json",
    "revision": "b487f05b1eef8731"
  },
  {
    "url": "./campaign/ep1/ep1-16-hard.level.json",
    "revision": "0630cb8a711d9f1b"
  },
  {
    "url": "./campaign/ep1/ep1-16-medium.level.json",
    "revision": "8a4a5afbe34fe90a"
  },
  {
    "url": "./campaign/ep1/ep1-17-easy.level.json",
    "revision": "cfa094eeb122ce69"
  },
  {
    "url": "./campaign/ep1/ep1-17-hard.level.json",
    "revision": "5d7f7328db69583b"
  },
  {
    "url": "./campaign/ep1/ep1-17-medium.level.json",
    "revision": "0eb278310455ab9b"
  },
  {
    "url": "./campaign/ep1/ep1-18-easy.level.json",
    "revision": "3cfe0d2a2d16474a"
  },
  {
    "url": "./campaign/ep1/ep1-18-hard.level.json",
    "revision": "00bf5e702bd55f08"
  },
  {
    "url": "./campaign/ep1/ep1-18-medium.level.json",
    "revision": "e62858c8d568ee3b"
  },
  {
    "url": "./campaign/ep1/ep1-19-easy.level.json",
    "revision": "e1e17aaf33621155"
  },
  {
    "url": "./campaign/ep1/ep1-19-hard.level.json",
    "revision": "575d718e14fcec11"
  },
  {
    "url": "./campaign/ep1/ep1-19-medium.level.json",
    "revision": "9a62073a97c62cfd"
  },
  {
    "url": "./campaign/ep1/ep1-20-easy.level.json",
    "revision": "1f52724710c28d39"
  },
  {
    "url": "./campaign/ep1/ep1-20-hard.level.json",
    "revision": "3244a1235032cd62"
  },
  {
    "url": "./campaign/ep1/ep1-20-medium.level.json",
    "revision": "acee0402b8a04933"
  },
  {
    "url": "./campaign/ep1/ep1-21-easy.level.json",
    "revision": "879d0de7d2be06f0"
  },
  {
    "url": "./campaign/ep1/ep1-21-hard.level.json",
    "revision": "3ad6cb069ac392f2"
  },
  {
    "url": "./campaign/ep1/ep1-21-medium.level.json",
    "revision": "bcef96771daebb8e"
  },
  {
    "url": "./campaign/ep1/ep1-22-easy.level.json",
    "revision": "d60db1ac6bee03f5"
  },
  {
    "url": "./campaign/ep1/ep1-22-hard.level.json",
    "revision": "3d6a2e909b529a10"
  },
  {
    "url": "./campaign/ep1/ep1-22-medium.level.json",
    "revision": "12a7efa1aaf45ea6"
  },
  {
    "url": "./campaign/ep1/ep1-23-easy.level.json",
    "revision": "2a00a4d3aaa793ce"
  },
  {
    "url": "./campaign/ep1/ep1-23-hard.level.json",
    "revision": "2f394b19c56c060b"
  },
  {
    "url": "./campaign/ep1/ep1-23-medium.level.json",
    "revision": "0c6a174c12411f5a"
  },
  {
    "url": "./campaign/ep1/ep1-24-easy.level.json",
    "revision": "1d9c26e8d780c6fd"
  },
  {
    "url": "./campaign/ep1/ep1-24-hard.level.json",
    "revision": "8006b3ab2342929b"
  },
  {
    "url": "./campaign/ep1/ep1-24-medium.level.json",
    "revision": "26bf1304e4c16b7f"
  },
  {
    "url": "./campaign/ep2/ep2-01-easy.level.json",
    "revision": "1c052b4e62fd7213"
  },
  {
    "url": "./campaign/ep2/ep2-01-hard.level.json",
    "revision": "e7b8907eae030108"
  },
  {
    "url": "./campaign/ep2/ep2-01-medium.level.json",
    "revision": "dab910b5f45455c4"
  },
  {
    "url": "./campaign/ep2/ep2-02-easy.level.json",
    "revision": "b29d93a5089bbb70"
  },
  {
    "url": "./campaign/ep2/ep2-02-hard.level.json",
    "revision": "bc762f54ff369d53"
  },
  {
    "url": "./campaign/ep2/ep2-02-medium.level.json",
    "revision": "89382c873f2d3d8a"
  },
  {
    "url": "./campaign/ep2/ep2-03-easy.level.json",
    "revision": "6251466ea7d7cdc1"
  },
  {
    "url": "./campaign/ep2/ep2-03-hard.level.json",
    "revision": "0ef0d1b6d0ad63cf"
  },
  {
    "url": "./campaign/ep2/ep2-03-medium.level.json",
    "revision": "6507e77c585bb483"
  },
  {
    "url": "./campaign/ep2/ep2-04-easy.level.json",
    "revision": "d451f7edff08566b"
  },
  {
    "url": "./campaign/ep2/ep2-04-hard.level.json",
    "revision": "438849d7e7a3f254"
  },
  {
    "url": "./campaign/ep2/ep2-04-medium.level.json",
    "revision": "2f707172afdd794a"
  },
  {
    "url": "./campaign/ep2/ep2-05-easy.level.json",
    "revision": "620e3f80d487560e"
  },
  {
    "url": "./campaign/ep2/ep2-05-hard.level.json",
    "revision": "e42bccb64e1d481a"
  },
  {
    "url": "./campaign/ep2/ep2-05-medium.level.json",
    "revision": "92ff3ecb6e6837ce"
  },
  {
    "url": "./campaign/ep2/ep2-06-easy.level.json",
    "revision": "95325b976ec2ea88"
  },
  {
    "url": "./campaign/ep2/ep2-06-hard.level.json",
    "revision": "3b7499e0e608f1d3"
  },
  {
    "url": "./campaign/ep2/ep2-06-medium.level.json",
    "revision": "2c5375e559d61509"
  },
  {
    "url": "./campaign/ep2/ep2-07-easy.level.json",
    "revision": "7952f6eb99100e5b"
  },
  {
    "url": "./campaign/ep2/ep2-07-hard.level.json",
    "revision": "c2e5f5ec4009dc36"
  },
  {
    "url": "./campaign/ep2/ep2-07-medium.level.json",
    "revision": "03e4f6b792445365"
  },
  {
    "url": "./campaign/ep2/ep2-08-easy.level.json",
    "revision": "dafdf2ee07d78c2e"
  },
  {
    "url": "./campaign/ep2/ep2-08-hard.level.json",
    "revision": "28b0223d1e7e64b5"
  },
  {
    "url": "./campaign/ep2/ep2-08-medium.level.json",
    "revision": "97a8047769f1ffba"
  },
  {
    "url": "./campaign/ep2/ep2-09-easy.level.json",
    "revision": "23337e20854727ff"
  },
  {
    "url": "./campaign/ep2/ep2-09-hard.level.json",
    "revision": "d1c6cdefdb964d18"
  },
  {
    "url": "./campaign/ep2/ep2-09-medium.level.json",
    "revision": "6c05ba091adb1cd6"
  },
  {
    "url": "./campaign/ep2/ep2-10-easy.level.json",
    "revision": "292d6248798fd520"
  },
  {
    "url": "./campaign/ep2/ep2-10-hard.level.json",
    "revision": "e8364b6ca6d7916b"
  },
  {
    "url": "./campaign/ep2/ep2-10-medium.level.json",
    "revision": "ea5c0919ec2d588e"
  },
  {
    "url": "./campaign/ep2/ep2-11-easy.level.json",
    "revision": "8475745361613ac0"
  },
  {
    "url": "./campaign/ep2/ep2-11-hard.level.json",
    "revision": "3753e2bb551eafda"
  },
  {
    "url": "./campaign/ep2/ep2-11-medium.level.json",
    "revision": "1901d74f74c64cba"
  },
  {
    "url": "./campaign/ep2/ep2-12-easy.level.json",
    "revision": "e010a8753e3f4402"
  },
  {
    "url": "./campaign/ep2/ep2-12-hard.level.json",
    "revision": "1deef093a096ad99"
  },
  {
    "url": "./campaign/ep2/ep2-12-medium.level.json",
    "revision": "df1397cdd4d4a674"
  },
  {
    "url": "./campaign/ep2/ep2-13-easy.level.json",
    "revision": "fc38ce462b3e9534"
  },
  {
    "url": "./campaign/ep2/ep2-13-hard.level.json",
    "revision": "411e8bdb60d11fad"
  },
  {
    "url": "./campaign/ep2/ep2-13-medium.level.json",
    "revision": "4183415c5d0085cb"
  },
  {
    "url": "./campaign/ep2/ep2-14-easy.level.json",
    "revision": "0aeadf1bab62c28d"
  },
  {
    "url": "./campaign/ep2/ep2-14-hard.level.json",
    "revision": "7e1fd5c9796ca287"
  },
  {
    "url": "./campaign/ep2/ep2-14-medium.level.json",
    "revision": "cb29d50d88840522"
  },
  {
    "url": "./campaign/ep2/ep2-15-easy.level.json",
    "revision": "1cfe0d562f36d8f9"
  },
  {
    "url": "./campaign/ep2/ep2-15-hard.level.json",
    "revision": "e60a3731aee244b8"
  },
  {
    "url": "./campaign/ep2/ep2-15-medium.level.json",
    "revision": "7849b39e5811f235"
  },
  {
    "url": "./campaign/ep2/ep2-16-easy.level.json",
    "revision": "937f7949994147f4"
  },
  {
    "url": "./campaign/ep2/ep2-16-hard.level.json",
    "revision": "eba1c59987e1e628"
  },
  {
    "url": "./campaign/ep2/ep2-16-medium.level.json",
    "revision": "126e80948135b835"
  },
  {
    "url": "./campaign/ep2/ep2-17-easy.level.json",
    "revision": "bbcb9cac75f8a754"
  },
  {
    "url": "./campaign/ep2/ep2-17-hard.level.json",
    "revision": "aa43456d7f25a651"
  },
  {
    "url": "./campaign/ep2/ep2-17-medium.level.json",
    "revision": "134aae6d6812b08f"
  },
  {
    "url": "./campaign/ep2/ep2-18-easy.level.json",
    "revision": "f565368ec7966f46"
  },
  {
    "url": "./campaign/ep2/ep2-18-hard.level.json",
    "revision": "fe7dd50d9603b6a4"
  },
  {
    "url": "./campaign/ep2/ep2-18-medium.level.json",
    "revision": "b4236a9fefc41971"
  },
  {
    "url": "./campaign/ep2/ep2-19-easy.level.json",
    "revision": "a7d1357e3cfaa314"
  },
  {
    "url": "./campaign/ep2/ep2-19-hard.level.json",
    "revision": "3a74edabddde9412"
  },
  {
    "url": "./campaign/ep2/ep2-19-medium.level.json",
    "revision": "5d4b7d2dd136f045"
  },
  {
    "url": "./campaign/ep2/ep2-20-easy.level.json",
    "revision": "0ad7550b280d1a67"
  },
  {
    "url": "./campaign/ep2/ep2-20-hard.level.json",
    "revision": "96a07915b1fb8410"
  },
  {
    "url": "./campaign/ep2/ep2-20-medium.level.json",
    "revision": "06ea43e53c0f0594"
  },
  {
    "url": "./campaign/ep2/ep2-21-easy.level.json",
    "revision": "e73487ebebe7af16"
  },
  {
    "url": "./campaign/ep2/ep2-21-hard.level.json",
    "revision": "5a5a4c32ff6ad3c4"
  },
  {
    "url": "./campaign/ep2/ep2-21-medium.level.json",
    "revision": "361ad85323c42a42"
  },
  {
    "url": "./campaign/ep2/ep2-22-easy.level.json",
    "revision": "8287568cf520c979"
  },
  {
    "url": "./campaign/ep2/ep2-22-hard.level.json",
    "revision": "6105c9047f07b62b"
  },
  {
    "url": "./campaign/ep2/ep2-22-medium.level.json",
    "revision": "30d1593d87360400"
  },
  {
    "url": "./campaign/ep2/ep2-23-easy.level.json",
    "revision": "c3943281670cdb7f"
  },
  {
    "url": "./campaign/ep2/ep2-23-hard.level.json",
    "revision": "4d712e71d1f1a09d"
  },
  {
    "url": "./campaign/ep2/ep2-23-medium.level.json",
    "revision": "926cc816e0f44656"
  },
  {
    "url": "./campaign/ep2/ep2-24-easy.level.json",
    "revision": "15ae02c52d19c923"
  },
  {
    "url": "./campaign/ep2/ep2-24-hard.level.json",
    "revision": "a9e22dbb84604184"
  },
  {
    "url": "./campaign/ep2/ep2-24-medium.level.json",
    "revision": "6df6df86fd233d98"
  },
  {
    "url": "./campaign/lobby/lobby-01-easy.level.json",
    "revision": "45b8279d94c1e98a"
  },
  {
    "url": "./campaign/lobby/lobby-01-hard.level.json",
    "revision": "38c4d2216dc5fa80"
  },
  {
    "url": "./campaign/lobby/lobby-01-medium.level.json",
    "revision": "8e393050d4807afe"
  },
  {
    "url": "./campaign/lobby/lobby-02-easy.level.json",
    "revision": "3c65dd8bbd0eee0a"
  },
  {
    "url": "./campaign/lobby/lobby-02-hard.level.json",
    "revision": "c16da161504ac0b6"
  },
  {
    "url": "./campaign/lobby/lobby-02-medium.level.json",
    "revision": "d0a371c9951045ce"
  },
  {
    "url": "./campaign/lobby/lobby-03-easy.level.json",
    "revision": "3e26af1c118b7373"
  },
  {
    "url": "./campaign/lobby/lobby-03-hard.level.json",
    "revision": "2da50b614ba246f3"
  },
  {
    "url": "./campaign/lobby/lobby-03-medium.level.json",
    "revision": "5746998740959709"
  },
  {
    "url": "./campaign/lobby/lobby-04-easy.level.json",
    "revision": "57f6f8c3e51163f3"
  },
  {
    "url": "./campaign/lobby/lobby-04-hard.level.json",
    "revision": "a37f7484b1d7b2d6"
  },
  {
    "url": "./campaign/lobby/lobby-04-medium.level.json",
    "revision": "4c40db9859f264ef"
  },
  {
    "url": "./campaign/lobby/lobby-05-easy.level.json",
    "revision": "726cdc9d902c14cf"
  },
  {
    "url": "./campaign/lobby/lobby-05-hard.level.json",
    "revision": "5aaf06b2f65be57c"
  },
  {
    "url": "./campaign/lobby/lobby-05-medium.level.json",
    "revision": "6d06d7153161d5bb"
  },
  {
    "url": "./campaign/lobby/lobby-06-easy.level.json",
    "revision": "411c7ced99be7f1f"
  },
  {
    "url": "./campaign/lobby/lobby-06-hard.level.json",
    "revision": "683b2a6f3014d40f"
  },
  {
    "url": "./campaign/lobby/lobby-06-medium.level.json",
    "revision": "b14fc524f34945d6"
  },
  {
    "url": "./campaign/lobby/lobby-07-easy.level.json",
    "revision": "a6d18950a37bdb77"
  },
  {
    "url": "./campaign/lobby/lobby-07-hard.level.json",
    "revision": "001480ee1cf308ca"
  },
  {
    "url": "./campaign/lobby/lobby-07-medium.level.json",
    "revision": "52f87804b8ce478a"
  },
  {
    "url": "./campaign/lobby/lobby-08-easy.level.json",
    "revision": "0badc93c13b656fc"
  },
  {
    "url": "./campaign/lobby/lobby-08-hard.level.json",
    "revision": "a5b69423d5ea6eee"
  },
  {
    "url": "./campaign/lobby/lobby-08-medium.level.json",
    "revision": "7d4a33114e3e9639"
  },
  {
    "url": "./campaign/lobby/lobby-09-easy.level.json",
    "revision": "e4be3eea2991c0e1"
  },
  {
    "url": "./campaign/lobby/lobby-09-hard.level.json",
    "revision": "d7475091eda2adb7"
  },
  {
    "url": "./campaign/lobby/lobby-09-medium.level.json",
    "revision": "b14a1ae83000bc27"
  },
  {
    "url": "./campaign/lobby/lobby-10-easy.level.json",
    "revision": "a66f091e00e65acd"
  },
  {
    "url": "./campaign/lobby/lobby-10-hard.level.json",
    "revision": "d9e18f81995c6db3"
  },
  {
    "url": "./campaign/lobby/lobby-10-medium.level.json",
    "revision": "8d9699e88f8919f6"
  },
  {
    "url": "./campaign/lobby/lobby-11-easy.level.json",
    "revision": "2fa2b28e5d7f9b92"
  },
  {
    "url": "./campaign/lobby/lobby-11-hard.level.json",
    "revision": "5f4ec70577d6a6d0"
  },
  {
    "url": "./campaign/lobby/lobby-11-medium.level.json",
    "revision": "32c1166a25891107"
  },
  {
    "url": "./campaign/lobby/lobby-12-easy.level.json",
    "revision": "2658b3e249b15bb7"
  },
  {
    "url": "./campaign/lobby/lobby-12-hard.level.json",
    "revision": "437c6e7887079263"
  },
  {
    "url": "./campaign/lobby/lobby-12-medium.level.json",
    "revision": "203309dbb01aa299"
  },
  {
    "url": "./campaign/lobby/lobby-13-easy.level.json",
    "revision": "91646c08942d1054"
  },
  {
    "url": "./campaign/lobby/lobby-13-hard.level.json",
    "revision": "0f0ff3b1755b0eab"
  },
  {
    "url": "./campaign/lobby/lobby-13-medium.level.json",
    "revision": "e1c419c0d30b4266"
  },
  {
    "url": "./campaign/lobby/lobby-14-easy.level.json",
    "revision": "4a97e3932c2d4c6e"
  },
  {
    "url": "./campaign/lobby/lobby-14-hard.level.json",
    "revision": "8926238caa81c7ef"
  },
  {
    "url": "./campaign/lobby/lobby-14-medium.level.json",
    "revision": "e3df50e1732523ae"
  },
  {
    "url": "./campaign/lobby/lobby-15-easy.level.json",
    "revision": "2ff58d37955e478e"
  },
  {
    "url": "./campaign/lobby/lobby-15-hard.level.json",
    "revision": "3d16268460677e99"
  },
  {
    "url": "./campaign/lobby/lobby-15-medium.level.json",
    "revision": "4ec58180e4c08861"
  },
  {
    "url": "./campaign/lobby/lobby-16-easy.level.json",
    "revision": "c0ac2dd231ee6358"
  },
  {
    "url": "./campaign/lobby/lobby-16-hard.level.json",
    "revision": "f3553602d97199cd"
  },
  {
    "url": "./campaign/lobby/lobby-16-medium.level.json",
    "revision": "eee0174f3147398f"
  },
  {
    "url": "./campaign/lobby/lobby-17-easy.level.json",
    "revision": "5a67f284110929e9"
  },
  {
    "url": "./campaign/lobby/lobby-17-hard.level.json",
    "revision": "14fd6cdcc754105a"
  },
  {
    "url": "./campaign/lobby/lobby-17-medium.level.json",
    "revision": "d36b331454973560"
  },
  {
    "url": "./campaign/lobby/lobby-18-easy.level.json",
    "revision": "f8837d3cae605cca"
  },
  {
    "url": "./campaign/lobby/lobby-18-hard.level.json",
    "revision": "f1bbc3362a03eefb"
  },
  {
    "url": "./campaign/lobby/lobby-18-medium.level.json",
    "revision": "7e921cb45028c568"
  },
  {
    "url": "./campaign/lobby/lobby-19-easy.level.json",
    "revision": "05811f9e66c832de"
  },
  {
    "url": "./campaign/lobby/lobby-19-hard.level.json",
    "revision": "7f4cc80a84378188"
  },
  {
    "url": "./campaign/lobby/lobby-19-medium.level.json",
    "revision": "9fe870206f97d54c"
  },
  {
    "url": "./campaign/lobby/lobby-20-easy.level.json",
    "revision": "6348ca0f0a4c7303"
  },
  {
    "url": "./campaign/lobby/lobby-20-hard.level.json",
    "revision": "b8e23289ed15b987"
  },
  {
    "url": "./campaign/lobby/lobby-20-medium.level.json",
    "revision": "462437087001351e"
  },
  {
    "url": "./campaign/lobby/lobby-21-easy.level.json",
    "revision": "4c2e8df140500d7b"
  },
  {
    "url": "./campaign/lobby/lobby-21-hard.level.json",
    "revision": "006d2f9cc7a416af"
  },
  {
    "url": "./campaign/lobby/lobby-21-medium.level.json",
    "revision": "1ccadbef577561cb"
  },
  {
    "url": "./campaign/lobby/lobby-22-easy.level.json",
    "revision": "17c90a4445098729"
  },
  {
    "url": "./campaign/lobby/lobby-22-hard.level.json",
    "revision": "22a961f1b1f27c9d"
  },
  {
    "url": "./campaign/lobby/lobby-22-medium.level.json",
    "revision": "c49165df17a2a9b5"
  },
  {
    "url": "./campaign/lobby/lobby-23-easy.level.json",
    "revision": "c4cc4c2e73793221"
  },
  {
    "url": "./campaign/lobby/lobby-23-hard.level.json",
    "revision": "9971d516848b1d3b"
  },
  {
    "url": "./campaign/lobby/lobby-23-medium.level.json",
    "revision": "7281d07197d4af0f"
  },
  {
    "url": "./campaign/lobby/lobby-24-easy.level.json",
    "revision": "1617cd66b08dd164"
  },
  {
    "url": "./campaign/lobby/lobby-24-hard.level.json",
    "revision": "95ee2681a4c16d11"
  },
  {
    "url": "./campaign/lobby/lobby-24-medium.level.json",
    "revision": "eb36d33cea731855"
  },
  {
    "url": "./editor/campaign/ep1/ep1-01-easy.level.json",
    "revision": "e2de162c018a8666"
  },
  {
    "url": "./editor/campaign/ep1/ep1-01-hard.level.json",
    "revision": "8f9df0f17b085867"
  },
  {
    "url": "./editor/campaign/ep1/ep1-01-medium.level.json",
    "revision": "342fe4b135bc40bb"
  },
  {
    "url": "./editor/campaign/ep1/ep1-02-easy.level.json",
    "revision": "828dfdbf6e193c21"
  },
  {
    "url": "./editor/campaign/ep1/ep1-02-hard.level.json",
    "revision": "7882ec2a8c020a55"
  },
  {
    "url": "./editor/campaign/ep1/ep1-02-medium.level.json",
    "revision": "c73f41a599303ac2"
  },
  {
    "url": "./editor/campaign/ep1/ep1-03-easy.level.json",
    "revision": "fc0cc1da142c7d70"
  },
  {
    "url": "./editor/campaign/ep1/ep1-03-hard.level.json",
    "revision": "2fa2495e0e2a132b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-03-medium.level.json",
    "revision": "3afcd4f6e3ad366f"
  },
  {
    "url": "./editor/campaign/ep1/ep1-04-easy.level.json",
    "revision": "3d6e7d64a8146772"
  },
  {
    "url": "./editor/campaign/ep1/ep1-04-hard.level.json",
    "revision": "2303b999d6158f21"
  },
  {
    "url": "./editor/campaign/ep1/ep1-04-medium.level.json",
    "revision": "a146b3050c895e4f"
  },
  {
    "url": "./editor/campaign/ep1/ep1-05-easy.level.json",
    "revision": "8f3e58448d7f1816"
  },
  {
    "url": "./editor/campaign/ep1/ep1-05-hard.level.json",
    "revision": "cb94dd8fadb81c6b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-05-medium.level.json",
    "revision": "6914ef9a4d648b2e"
  },
  {
    "url": "./editor/campaign/ep1/ep1-06-easy.level.json",
    "revision": "d51d6e12e8262158"
  },
  {
    "url": "./editor/campaign/ep1/ep1-06-hard.level.json",
    "revision": "4fb7adc73c486238"
  },
  {
    "url": "./editor/campaign/ep1/ep1-06-medium.level.json",
    "revision": "9c84ed40df0aa82e"
  },
  {
    "url": "./editor/campaign/ep1/ep1-07-easy.level.json",
    "revision": "93fa2b160b19d85b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-07-hard.level.json",
    "revision": "1b57aace1b4b2d83"
  },
  {
    "url": "./editor/campaign/ep1/ep1-07-medium.level.json",
    "revision": "d7812f62aa5ff3e1"
  },
  {
    "url": "./editor/campaign/ep1/ep1-08-easy.level.json",
    "revision": "aea707288cc0a5b8"
  },
  {
    "url": "./editor/campaign/ep1/ep1-08-hard.level.json",
    "revision": "36bbbb89234a0d1a"
  },
  {
    "url": "./editor/campaign/ep1/ep1-08-medium.level.json",
    "revision": "7b2bfea1ba3a678b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-09-easy.level.json",
    "revision": "ddaec7fab1b8af66"
  },
  {
    "url": "./editor/campaign/ep1/ep1-09-hard.level.json",
    "revision": "394ac81e4d0ddc00"
  },
  {
    "url": "./editor/campaign/ep1/ep1-09-medium.level.json",
    "revision": "e9bbe0a32b6715d1"
  },
  {
    "url": "./editor/campaign/ep1/ep1-10-easy.level.json",
    "revision": "eccede2ef685a708"
  },
  {
    "url": "./editor/campaign/ep1/ep1-10-hard.level.json",
    "revision": "4fad48e48afa38ae"
  },
  {
    "url": "./editor/campaign/ep1/ep1-10-medium.level.json",
    "revision": "ba58df9d5f141f3d"
  },
  {
    "url": "./editor/campaign/ep1/ep1-11-easy.level.json",
    "revision": "2bb4b11a1a886276"
  },
  {
    "url": "./editor/campaign/ep1/ep1-11-hard.level.json",
    "revision": "40c6c1d0f24bc9ec"
  },
  {
    "url": "./editor/campaign/ep1/ep1-11-medium.level.json",
    "revision": "55f6d85ffb9a41ac"
  },
  {
    "url": "./editor/campaign/ep1/ep1-12-easy.level.json",
    "revision": "7af029e85badb6e2"
  },
  {
    "url": "./editor/campaign/ep1/ep1-12-hard.level.json",
    "revision": "1da568df3b4549bd"
  },
  {
    "url": "./editor/campaign/ep1/ep1-12-medium.level.json",
    "revision": "e0226df12ac5faff"
  },
  {
    "url": "./editor/campaign/ep1/ep1-13-easy.level.json",
    "revision": "2907476c84e4c930"
  },
  {
    "url": "./editor/campaign/ep1/ep1-13-hard.level.json",
    "revision": "3a28aecec63665e4"
  },
  {
    "url": "./editor/campaign/ep1/ep1-13-medium.level.json",
    "revision": "ffdcfe05d83586da"
  },
  {
    "url": "./editor/campaign/ep1/ep1-14-easy.level.json",
    "revision": "ef2a57b57149e10e"
  },
  {
    "url": "./editor/campaign/ep1/ep1-14-hard.level.json",
    "revision": "c3f6bb02623f63f4"
  },
  {
    "url": "./editor/campaign/ep1/ep1-14-medium.level.json",
    "revision": "e53742da0e41e24d"
  },
  {
    "url": "./editor/campaign/ep1/ep1-15-easy.level.json",
    "revision": "d1569132d7138f62"
  },
  {
    "url": "./editor/campaign/ep1/ep1-15-hard.level.json",
    "revision": "7707aeb79bc30aaf"
  },
  {
    "url": "./editor/campaign/ep1/ep1-15-medium.level.json",
    "revision": "ab2bdfe6946f0514"
  },
  {
    "url": "./editor/campaign/ep1/ep1-16-easy.level.json",
    "revision": "b487f05b1eef8731"
  },
  {
    "url": "./editor/campaign/ep1/ep1-16-hard.level.json",
    "revision": "0630cb8a711d9f1b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-16-medium.level.json",
    "revision": "8a4a5afbe34fe90a"
  },
  {
    "url": "./editor/campaign/ep1/ep1-17-easy.level.json",
    "revision": "cfa094eeb122ce69"
  },
  {
    "url": "./editor/campaign/ep1/ep1-17-hard.level.json",
    "revision": "5d7f7328db69583b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-17-medium.level.json",
    "revision": "0eb278310455ab9b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-18-easy.level.json",
    "revision": "3cfe0d2a2d16474a"
  },
  {
    "url": "./editor/campaign/ep1/ep1-18-hard.level.json",
    "revision": "00bf5e702bd55f08"
  },
  {
    "url": "./editor/campaign/ep1/ep1-18-medium.level.json",
    "revision": "e62858c8d568ee3b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-19-easy.level.json",
    "revision": "e1e17aaf33621155"
  },
  {
    "url": "./editor/campaign/ep1/ep1-19-hard.level.json",
    "revision": "575d718e14fcec11"
  },
  {
    "url": "./editor/campaign/ep1/ep1-19-medium.level.json",
    "revision": "9a62073a97c62cfd"
  },
  {
    "url": "./editor/campaign/ep1/ep1-20-easy.level.json",
    "revision": "1f52724710c28d39"
  },
  {
    "url": "./editor/campaign/ep1/ep1-20-hard.level.json",
    "revision": "3244a1235032cd62"
  },
  {
    "url": "./editor/campaign/ep1/ep1-20-medium.level.json",
    "revision": "acee0402b8a04933"
  },
  {
    "url": "./editor/campaign/ep1/ep1-21-easy.level.json",
    "revision": "879d0de7d2be06f0"
  },
  {
    "url": "./editor/campaign/ep1/ep1-21-hard.level.json",
    "revision": "3ad6cb069ac392f2"
  },
  {
    "url": "./editor/campaign/ep1/ep1-21-medium.level.json",
    "revision": "bcef96771daebb8e"
  },
  {
    "url": "./editor/campaign/ep1/ep1-22-easy.level.json",
    "revision": "d60db1ac6bee03f5"
  },
  {
    "url": "./editor/campaign/ep1/ep1-22-hard.level.json",
    "revision": "3d6a2e909b529a10"
  },
  {
    "url": "./editor/campaign/ep1/ep1-22-medium.level.json",
    "revision": "12a7efa1aaf45ea6"
  },
  {
    "url": "./editor/campaign/ep1/ep1-23-easy.level.json",
    "revision": "2a00a4d3aaa793ce"
  },
  {
    "url": "./editor/campaign/ep1/ep1-23-hard.level.json",
    "revision": "2f394b19c56c060b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-23-medium.level.json",
    "revision": "0c6a174c12411f5a"
  },
  {
    "url": "./editor/campaign/ep1/ep1-24-easy.level.json",
    "revision": "1d9c26e8d780c6fd"
  },
  {
    "url": "./editor/campaign/ep1/ep1-24-hard.level.json",
    "revision": "8006b3ab2342929b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-24-medium.level.json",
    "revision": "26bf1304e4c16b7f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-01-easy.level.json",
    "revision": "1c052b4e62fd7213"
  },
  {
    "url": "./editor/campaign/ep2/ep2-01-hard.level.json",
    "revision": "e7b8907eae030108"
  },
  {
    "url": "./editor/campaign/ep2/ep2-01-medium.level.json",
    "revision": "dab910b5f45455c4"
  },
  {
    "url": "./editor/campaign/ep2/ep2-02-easy.level.json",
    "revision": "b29d93a5089bbb70"
  },
  {
    "url": "./editor/campaign/ep2/ep2-02-hard.level.json",
    "revision": "bc762f54ff369d53"
  },
  {
    "url": "./editor/campaign/ep2/ep2-02-medium.level.json",
    "revision": "89382c873f2d3d8a"
  },
  {
    "url": "./editor/campaign/ep2/ep2-03-easy.level.json",
    "revision": "6251466ea7d7cdc1"
  },
  {
    "url": "./editor/campaign/ep2/ep2-03-hard.level.json",
    "revision": "0ef0d1b6d0ad63cf"
  },
  {
    "url": "./editor/campaign/ep2/ep2-03-medium.level.json",
    "revision": "6507e77c585bb483"
  },
  {
    "url": "./editor/campaign/ep2/ep2-04-easy.level.json",
    "revision": "d451f7edff08566b"
  },
  {
    "url": "./editor/campaign/ep2/ep2-04-hard.level.json",
    "revision": "438849d7e7a3f254"
  },
  {
    "url": "./editor/campaign/ep2/ep2-04-medium.level.json",
    "revision": "2f707172afdd794a"
  },
  {
    "url": "./editor/campaign/ep2/ep2-05-easy.level.json",
    "revision": "620e3f80d487560e"
  },
  {
    "url": "./editor/campaign/ep2/ep2-05-hard.level.json",
    "revision": "e42bccb64e1d481a"
  },
  {
    "url": "./editor/campaign/ep2/ep2-05-medium.level.json",
    "revision": "92ff3ecb6e6837ce"
  },
  {
    "url": "./editor/campaign/ep2/ep2-06-easy.level.json",
    "revision": "95325b976ec2ea88"
  },
  {
    "url": "./editor/campaign/ep2/ep2-06-hard.level.json",
    "revision": "3b7499e0e608f1d3"
  },
  {
    "url": "./editor/campaign/ep2/ep2-06-medium.level.json",
    "revision": "2c5375e559d61509"
  },
  {
    "url": "./editor/campaign/ep2/ep2-07-easy.level.json",
    "revision": "7952f6eb99100e5b"
  },
  {
    "url": "./editor/campaign/ep2/ep2-07-hard.level.json",
    "revision": "c2e5f5ec4009dc36"
  },
  {
    "url": "./editor/campaign/ep2/ep2-07-medium.level.json",
    "revision": "03e4f6b792445365"
  },
  {
    "url": "./editor/campaign/ep2/ep2-08-easy.level.json",
    "revision": "dafdf2ee07d78c2e"
  },
  {
    "url": "./editor/campaign/ep2/ep2-08-hard.level.json",
    "revision": "28b0223d1e7e64b5"
  },
  {
    "url": "./editor/campaign/ep2/ep2-08-medium.level.json",
    "revision": "97a8047769f1ffba"
  },
  {
    "url": "./editor/campaign/ep2/ep2-09-easy.level.json",
    "revision": "23337e20854727ff"
  },
  {
    "url": "./editor/campaign/ep2/ep2-09-hard.level.json",
    "revision": "d1c6cdefdb964d18"
  },
  {
    "url": "./editor/campaign/ep2/ep2-09-medium.level.json",
    "revision": "6c05ba091adb1cd6"
  },
  {
    "url": "./editor/campaign/ep2/ep2-10-easy.level.json",
    "revision": "292d6248798fd520"
  },
  {
    "url": "./editor/campaign/ep2/ep2-10-hard.level.json",
    "revision": "e8364b6ca6d7916b"
  },
  {
    "url": "./editor/campaign/ep2/ep2-10-medium.level.json",
    "revision": "ea5c0919ec2d588e"
  },
  {
    "url": "./editor/campaign/ep2/ep2-11-easy.level.json",
    "revision": "8475745361613ac0"
  },
  {
    "url": "./editor/campaign/ep2/ep2-11-hard.level.json",
    "revision": "3753e2bb551eafda"
  },
  {
    "url": "./editor/campaign/ep2/ep2-11-medium.level.json",
    "revision": "1901d74f74c64cba"
  },
  {
    "url": "./editor/campaign/ep2/ep2-12-easy.level.json",
    "revision": "e010a8753e3f4402"
  },
  {
    "url": "./editor/campaign/ep2/ep2-12-hard.level.json",
    "revision": "1deef093a096ad99"
  },
  {
    "url": "./editor/campaign/ep2/ep2-12-medium.level.json",
    "revision": "df1397cdd4d4a674"
  },
  {
    "url": "./editor/campaign/ep2/ep2-13-easy.level.json",
    "revision": "fc38ce462b3e9534"
  },
  {
    "url": "./editor/campaign/ep2/ep2-13-hard.level.json",
    "revision": "411e8bdb60d11fad"
  },
  {
    "url": "./editor/campaign/ep2/ep2-13-medium.level.json",
    "revision": "4183415c5d0085cb"
  },
  {
    "url": "./editor/campaign/ep2/ep2-14-easy.level.json",
    "revision": "0aeadf1bab62c28d"
  },
  {
    "url": "./editor/campaign/ep2/ep2-14-hard.level.json",
    "revision": "7e1fd5c9796ca287"
  },
  {
    "url": "./editor/campaign/ep2/ep2-14-medium.level.json",
    "revision": "cb29d50d88840522"
  },
  {
    "url": "./editor/campaign/ep2/ep2-15-easy.level.json",
    "revision": "1cfe0d562f36d8f9"
  },
  {
    "url": "./editor/campaign/ep2/ep2-15-hard.level.json",
    "revision": "e60a3731aee244b8"
  },
  {
    "url": "./editor/campaign/ep2/ep2-15-medium.level.json",
    "revision": "7849b39e5811f235"
  },
  {
    "url": "./editor/campaign/ep2/ep2-16-easy.level.json",
    "revision": "937f7949994147f4"
  },
  {
    "url": "./editor/campaign/ep2/ep2-16-hard.level.json",
    "revision": "eba1c59987e1e628"
  },
  {
    "url": "./editor/campaign/ep2/ep2-16-medium.level.json",
    "revision": "126e80948135b835"
  },
  {
    "url": "./editor/campaign/ep2/ep2-17-easy.level.json",
    "revision": "bbcb9cac75f8a754"
  },
  {
    "url": "./editor/campaign/ep2/ep2-17-hard.level.json",
    "revision": "aa43456d7f25a651"
  },
  {
    "url": "./editor/campaign/ep2/ep2-17-medium.level.json",
    "revision": "134aae6d6812b08f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-18-easy.level.json",
    "revision": "f565368ec7966f46"
  },
  {
    "url": "./editor/campaign/ep2/ep2-18-hard.level.json",
    "revision": "fe7dd50d9603b6a4"
  },
  {
    "url": "./editor/campaign/ep2/ep2-18-medium.level.json",
    "revision": "b4236a9fefc41971"
  },
  {
    "url": "./editor/campaign/ep2/ep2-19-easy.level.json",
    "revision": "a7d1357e3cfaa314"
  },
  {
    "url": "./editor/campaign/ep2/ep2-19-hard.level.json",
    "revision": "3a74edabddde9412"
  },
  {
    "url": "./editor/campaign/ep2/ep2-19-medium.level.json",
    "revision": "5d4b7d2dd136f045"
  },
  {
    "url": "./editor/campaign/ep2/ep2-20-easy.level.json",
    "revision": "0ad7550b280d1a67"
  },
  {
    "url": "./editor/campaign/ep2/ep2-20-hard.level.json",
    "revision": "96a07915b1fb8410"
  },
  {
    "url": "./editor/campaign/ep2/ep2-20-medium.level.json",
    "revision": "06ea43e53c0f0594"
  },
  {
    "url": "./editor/campaign/ep2/ep2-21-easy.level.json",
    "revision": "e73487ebebe7af16"
  },
  {
    "url": "./editor/campaign/ep2/ep2-21-hard.level.json",
    "revision": "5a5a4c32ff6ad3c4"
  },
  {
    "url": "./editor/campaign/ep2/ep2-21-medium.level.json",
    "revision": "361ad85323c42a42"
  },
  {
    "url": "./editor/campaign/ep2/ep2-22-easy.level.json",
    "revision": "8287568cf520c979"
  },
  {
    "url": "./editor/campaign/ep2/ep2-22-hard.level.json",
    "revision": "6105c9047f07b62b"
  },
  {
    "url": "./editor/campaign/ep2/ep2-22-medium.level.json",
    "revision": "30d1593d87360400"
  },
  {
    "url": "./editor/campaign/ep2/ep2-23-easy.level.json",
    "revision": "c3943281670cdb7f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-23-hard.level.json",
    "revision": "4d712e71d1f1a09d"
  },
  {
    "url": "./editor/campaign/ep2/ep2-23-medium.level.json",
    "revision": "926cc816e0f44656"
  },
  {
    "url": "./editor/campaign/ep2/ep2-24-easy.level.json",
    "revision": "15ae02c52d19c923"
  },
  {
    "url": "./editor/campaign/ep2/ep2-24-hard.level.json",
    "revision": "a9e22dbb84604184"
  },
  {
    "url": "./editor/campaign/ep2/ep2-24-medium.level.json",
    "revision": "6df6df86fd233d98"
  },
  {
    "url": "./editor/campaign/lobby/lobby-01-easy.level.json",
    "revision": "45b8279d94c1e98a"
  },
  {
    "url": "./editor/campaign/lobby/lobby-01-hard.level.json",
    "revision": "38c4d2216dc5fa80"
  },
  {
    "url": "./editor/campaign/lobby/lobby-01-medium.level.json",
    "revision": "8e393050d4807afe"
  },
  {
    "url": "./editor/campaign/lobby/lobby-02-easy.level.json",
    "revision": "3c65dd8bbd0eee0a"
  },
  {
    "url": "./editor/campaign/lobby/lobby-02-hard.level.json",
    "revision": "c16da161504ac0b6"
  },
  {
    "url": "./editor/campaign/lobby/lobby-02-medium.level.json",
    "revision": "d0a371c9951045ce"
  },
  {
    "url": "./editor/campaign/lobby/lobby-03-easy.level.json",
    "revision": "3e26af1c118b7373"
  },
  {
    "url": "./editor/campaign/lobby/lobby-03-hard.level.json",
    "revision": "2da50b614ba246f3"
  },
  {
    "url": "./editor/campaign/lobby/lobby-03-medium.level.json",
    "revision": "5746998740959709"
  },
  {
    "url": "./editor/campaign/lobby/lobby-04-easy.level.json",
    "revision": "57f6f8c3e51163f3"
  },
  {
    "url": "./editor/campaign/lobby/lobby-04-hard.level.json",
    "revision": "a37f7484b1d7b2d6"
  },
  {
    "url": "./editor/campaign/lobby/lobby-04-medium.level.json",
    "revision": "4c40db9859f264ef"
  },
  {
    "url": "./editor/campaign/lobby/lobby-05-easy.level.json",
    "revision": "726cdc9d902c14cf"
  },
  {
    "url": "./editor/campaign/lobby/lobby-05-hard.level.json",
    "revision": "5aaf06b2f65be57c"
  },
  {
    "url": "./editor/campaign/lobby/lobby-05-medium.level.json",
    "revision": "6d06d7153161d5bb"
  },
  {
    "url": "./editor/campaign/lobby/lobby-06-easy.level.json",
    "revision": "411c7ced99be7f1f"
  },
  {
    "url": "./editor/campaign/lobby/lobby-06-hard.level.json",
    "revision": "683b2a6f3014d40f"
  },
  {
    "url": "./editor/campaign/lobby/lobby-06-medium.level.json",
    "revision": "b14fc524f34945d6"
  },
  {
    "url": "./editor/campaign/lobby/lobby-07-easy.level.json",
    "revision": "a6d18950a37bdb77"
  },
  {
    "url": "./editor/campaign/lobby/lobby-07-hard.level.json",
    "revision": "001480ee1cf308ca"
  },
  {
    "url": "./editor/campaign/lobby/lobby-07-medium.level.json",
    "revision": "52f87804b8ce478a"
  },
  {
    "url": "./editor/campaign/lobby/lobby-08-easy.level.json",
    "revision": "0badc93c13b656fc"
  },
  {
    "url": "./editor/campaign/lobby/lobby-08-hard.level.json",
    "revision": "a5b69423d5ea6eee"
  },
  {
    "url": "./editor/campaign/lobby/lobby-08-medium.level.json",
    "revision": "7d4a33114e3e9639"
  },
  {
    "url": "./editor/campaign/lobby/lobby-09-easy.level.json",
    "revision": "e4be3eea2991c0e1"
  },
  {
    "url": "./editor/campaign/lobby/lobby-09-hard.level.json",
    "revision": "d7475091eda2adb7"
  },
  {
    "url": "./editor/campaign/lobby/lobby-09-medium.level.json",
    "revision": "b14a1ae83000bc27"
  },
  {
    "url": "./editor/campaign/lobby/lobby-10-easy.level.json",
    "revision": "a66f091e00e65acd"
  },
  {
    "url": "./editor/campaign/lobby/lobby-10-hard.level.json",
    "revision": "d9e18f81995c6db3"
  },
  {
    "url": "./editor/campaign/lobby/lobby-10-medium.level.json",
    "revision": "8d9699e88f8919f6"
  },
  {
    "url": "./editor/campaign/lobby/lobby-11-easy.level.json",
    "revision": "2fa2b28e5d7f9b92"
  },
  {
    "url": "./editor/campaign/lobby/lobby-11-hard.level.json",
    "revision": "5f4ec70577d6a6d0"
  },
  {
    "url": "./editor/campaign/lobby/lobby-11-medium.level.json",
    "revision": "32c1166a25891107"
  },
  {
    "url": "./editor/campaign/lobby/lobby-12-easy.level.json",
    "revision": "2658b3e249b15bb7"
  },
  {
    "url": "./editor/campaign/lobby/lobby-12-hard.level.json",
    "revision": "437c6e7887079263"
  },
  {
    "url": "./editor/campaign/lobby/lobby-12-medium.level.json",
    "revision": "203309dbb01aa299"
  },
  {
    "url": "./editor/campaign/lobby/lobby-13-easy.level.json",
    "revision": "91646c08942d1054"
  },
  {
    "url": "./editor/campaign/lobby/lobby-13-hard.level.json",
    "revision": "0f0ff3b1755b0eab"
  },
  {
    "url": "./editor/campaign/lobby/lobby-13-medium.level.json",
    "revision": "e1c419c0d30b4266"
  },
  {
    "url": "./editor/campaign/lobby/lobby-14-easy.level.json",
    "revision": "4a97e3932c2d4c6e"
  },
  {
    "url": "./editor/campaign/lobby/lobby-14-hard.level.json",
    "revision": "8926238caa81c7ef"
  },
  {
    "url": "./editor/campaign/lobby/lobby-14-medium.level.json",
    "revision": "e3df50e1732523ae"
  },
  {
    "url": "./editor/campaign/lobby/lobby-15-easy.level.json",
    "revision": "2ff58d37955e478e"
  },
  {
    "url": "./editor/campaign/lobby/lobby-15-hard.level.json",
    "revision": "3d16268460677e99"
  },
  {
    "url": "./editor/campaign/lobby/lobby-15-medium.level.json",
    "revision": "4ec58180e4c08861"
  },
  {
    "url": "./editor/campaign/lobby/lobby-16-easy.level.json",
    "revision": "c0ac2dd231ee6358"
  },
  {
    "url": "./editor/campaign/lobby/lobby-16-hard.level.json",
    "revision": "f3553602d97199cd"
  },
  {
    "url": "./editor/campaign/lobby/lobby-16-medium.level.json",
    "revision": "eee0174f3147398f"
  },
  {
    "url": "./editor/campaign/lobby/lobby-17-easy.level.json",
    "revision": "5a67f284110929e9"
  },
  {
    "url": "./editor/campaign/lobby/lobby-17-hard.level.json",
    "revision": "14fd6cdcc754105a"
  },
  {
    "url": "./editor/campaign/lobby/lobby-17-medium.level.json",
    "revision": "d36b331454973560"
  },
  {
    "url": "./editor/campaign/lobby/lobby-18-easy.level.json",
    "revision": "f8837d3cae605cca"
  },
  {
    "url": "./editor/campaign/lobby/lobby-18-hard.level.json",
    "revision": "f1bbc3362a03eefb"
  },
  {
    "url": "./editor/campaign/lobby/lobby-18-medium.level.json",
    "revision": "7e921cb45028c568"
  },
  {
    "url": "./editor/campaign/lobby/lobby-19-easy.level.json",
    "revision": "05811f9e66c832de"
  },
  {
    "url": "./editor/campaign/lobby/lobby-19-hard.level.json",
    "revision": "7f4cc80a84378188"
  },
  {
    "url": "./editor/campaign/lobby/lobby-19-medium.level.json",
    "revision": "9fe870206f97d54c"
  },
  {
    "url": "./editor/campaign/lobby/lobby-20-easy.level.json",
    "revision": "6348ca0f0a4c7303"
  },
  {
    "url": "./editor/campaign/lobby/lobby-20-hard.level.json",
    "revision": "b8e23289ed15b987"
  },
  {
    "url": "./editor/campaign/lobby/lobby-20-medium.level.json",
    "revision": "462437087001351e"
  },
  {
    "url": "./editor/campaign/lobby/lobby-21-easy.level.json",
    "revision": "4c2e8df140500d7b"
  },
  {
    "url": "./editor/campaign/lobby/lobby-21-hard.level.json",
    "revision": "006d2f9cc7a416af"
  },
  {
    "url": "./editor/campaign/lobby/lobby-21-medium.level.json",
    "revision": "1ccadbef577561cb"
  },
  {
    "url": "./editor/campaign/lobby/lobby-22-easy.level.json",
    "revision": "17c90a4445098729"
  },
  {
    "url": "./editor/campaign/lobby/lobby-22-hard.level.json",
    "revision": "22a961f1b1f27c9d"
  },
  {
    "url": "./editor/campaign/lobby/lobby-22-medium.level.json",
    "revision": "c49165df17a2a9b5"
  },
  {
    "url": "./editor/campaign/lobby/lobby-23-easy.level.json",
    "revision": "c4cc4c2e73793221"
  },
  {
    "url": "./editor/campaign/lobby/lobby-23-hard.level.json",
    "revision": "9971d516848b1d3b"
  },
  {
    "url": "./editor/campaign/lobby/lobby-23-medium.level.json",
    "revision": "7281d07197d4af0f"
  },
  {
    "url": "./editor/campaign/lobby/lobby-24-easy.level.json",
    "revision": "1617cd66b08dd164"
  },
  {
    "url": "./editor/campaign/lobby/lobby-24-hard.level.json",
    "revision": "95ee2681a4c16d11"
  },
  {
    "url": "./editor/campaign/lobby/lobby-24-medium.level.json",
    "revision": "eb36d33cea731855"
  },
  {
    "url": "./editor/editor.js",
    "revision": "88a44afb466d88fc"
  },
  {
    "url": "./editor/index.html",
    "revision": "c42be131f25c7ef1"
  },
  {
    "url": "./editor/nubu-level.schema.json",
    "revision": "773b8e2a8491ffcd"
  },
  {
    "url": "./editor/samples/ep1-01.level.json",
    "revision": "2320f9166800a58b"
  },
  {
    "url": "./editor/styles.css",
    "revision": "350ef2a54261906b"
  },
  {
    "url": "./icons/icon-192.png",
    "revision": "c5a91257ecf646b4"
  },
  {
    "url": "./icons/icon-512.png",
    "revision": "f6484ebc5d053e9f"
  },
  {
    "url": "./icons/icon-maskable-512.png",
    "revision": "f6484ebc5d053e9f"
  },
  {
    "url": "./index.html",
    "revision": "c8d0fdca35c39770"
  },
  {
    "url": "./manifest.webmanifest",
    "revision": "3e228b05a119616e"
  },
  {
    "url": "./pwa-register.js",
    "revision": "c847a244c635baf9"
  },
  {
    "url": "./robots.txt",
    "revision": "331ea9090db0c9f6"
  }
];
const PRECACHE_CONCURRENCY = 6;
const PRECACHE_RETRY_DELAYS_MS = [250, 750, 1750];
const SCOPE_URL = new URL('./', self.location.href);
const SCOPE_KEY = SCOPE_URL.pathname
  .replace(/^\/+|\/+$/g, '')
  .replace(/[^a-z0-9_-]+/gi, '-') || 'root';
const CACHE_PREFIX = `nubu2600-app-${SCOPE_KEY}-`;
const CACHE_NAME = `${CACHE_PREFIX}e1065907b0697557`;
const ROOT_DOCUMENT_URL = new URL('index.html', SCOPE_URL).href;
const EDITOR_DOCUMENT_URL = new URL('editor/index.html', SCOPE_URL).href;
const PRECACHE_URLS = new Set(PRECACHE_ENTRIES.map(entry => new URL(entry.url, SCOPE_URL).href));
const PRECACHE_REVISIONS = new Map(PRECACHE_ENTRIES.map(entry => [new URL(entry.url, SCOPE_URL).href, entry.revision]));
const CORE_PRECACHE_ENTRIES = PRECACHE_ENTRIES.filter(entry => !/\/(?:editor\/)?campaign\//.test(entry.url)
  || /\/(?:editor\/)?campaign\/ep1\/ep1-01-/.test(entry.url));
let completionPromise = null;

function withoutSearch(requestOrUrl) {
  const url = new URL(typeof requestOrUrl === 'string' ? requestOrUrl : requestOrUrl.url);
  url.search = '';
  url.hash = '';
  return url.href;
}

function bufferHex(buffer) {
  return [...new Uint8Array(buffer)].map(byte => byte.toString(16).padStart(2, '0')).join('');
}

async function responseMatchesRevision(response, expectedRevision) {
  const digest = await crypto.subtle.digest('SHA-256', await response.clone().arrayBuffer());
  return bufferHex(digest).startsWith(expectedRevision);
}

async function populatePrecache(entries, { onlyMissing=false, cacheMode='reload' }={}) {
  const cache = await caches.open(CACHE_NAME);
  let cursor = 0;
  const worker = async () => {
    while (cursor < entries.length) {
      const entry = entries[cursor++];
      const url = new URL(entry.url, SCOPE_URL).href;
      if (onlyMissing && await cache.match(url)) continue;
      const requestUrl = new URL(url);
      requestUrl.searchParams.set('nubu-precache', CACHE_NAME);
      const response = await fetch(new Request(requestUrl, {
        cache: cacheMode,
        credentials: 'same-origin',
      }));
      if (!response.ok) throw new Error(`Precache failed (${response.status}): ${entry.url}`);
      if (!await responseMatchesRevision(response, entry.revision)) {
        throw new Error(`Precache revision mismatch: ${entry.url}`);
      }
      await cache.put(url, response);
    }
  };
  const workerCount = Math.min(PRECACHE_CONCURRENCY, entries.length);
  await Promise.all(Array.from({ length: workerCount }, () => worker()));
}

function completePrecache() {
  if (!completionPromise) {
    completionPromise = (async () => {
      let lastError = null;
      for (let attempt = 0; attempt <= PRECACHE_RETRY_DELAYS_MS.length; attempt++) {
        try {
          await populatePrecache(PRECACHE_ENTRIES, { onlyMissing:true, cacheMode:'reload' });
          return;
        } catch (error) {
          lastError = error;
          if (attempt >= PRECACHE_RETRY_DELAYS_MS.length) break;
          await new Promise(resolve => setTimeout(resolve, PRECACHE_RETRY_DELAYS_MS[attempt]));
        }
      }
      throw lastError || new Error('Offline cache completion failed');
    })()
      .catch(error => {
        completionPromise = null;
        throw error;
      });
  }
  return completionPromise;
}

async function cachedResponse(requestOrUrl) {
  const cache = await caches.open(CACHE_NAME);
  return cache.match(withoutSearch(requestOrUrl));
}

async function networkFirst(request, fallbackUrl=request) {
  try {
    const response = await fetch(new Request(request, { cache: 'no-store' }));
    if (response.ok || response.status < 500) return response;
    const cached = await cachedResponse(fallbackUrl);
    return cached || response;
  } catch (error) {
    const cached = await cachedResponse(fallbackUrl);
    if (cached) return cached;
    throw error;
  }
}

async function cacheFirstAndFill(request, normalizedUrl) {
  const cached = await cachedResponse(normalizedUrl);
  if (cached) return cached;
  const expectedRevision = PRECACHE_REVISIONS.get(normalizedUrl);
  const response = await fetch(new Request(request, { cache:expectedRevision ? 'reload' : request.cache }));
  if (response.ok && expectedRevision && !await responseMatchesRevision(response, expectedRevision)) {
    throw new Error(`Runtime revision mismatch: ${normalizedUrl}`);
  }
  if (response.ok && expectedRevision) {
    const cache = await caches.open(CACHE_NAME);
    await cache.put(normalizedUrl, response.clone());
  }
  return response;
}

function navigationFallback(request) {
  const url = new URL(request.url);
  const relativePath = url.pathname.slice(SCOPE_URL.pathname.length);
  if (relativePath === 'editor' || relativePath === 'editor/' || relativePath === 'editor/index.html') return EDITOR_DOCUMENT_URL;
  return ROOT_DOCUMENT_URL;
}

function requestsCurrentRevision(url, normalizedUrl) {
  const requested = url.searchParams.get('v');
  const cached = PRECACHE_REVISIONS.get(normalizedUrl);
  return !!(requested && cached && cached.startsWith(requested));
}

self.addEventListener('install', event => {
  event.waitUntil(populatePrecache(CORE_PRECACHE_ENTRIES));
});

self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map(key => caches.delete(key)));
  })());
});

self.addEventListener('message', event => {
  if (event.data?.type !== 'nubu:complete-offline-cache') return;
  event.waitUntil(completePrecache());
});

self.addEventListener('fetch', event => {
  const request = event.request;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== SCOPE_URL.origin || !url.pathname.startsWith(SCOPE_URL.pathname)) return;

  if (request.mode === 'navigate') {
    const fallbackUrl = navigationFallback(request);
    event.respondWith(url.searchParams.has('build')
      ? networkFirst(request, fallbackUrl)
      : cachedResponse(fallbackUrl).then(response => response || networkFirst(request, fallbackUrl)));
    return;
  }

  const normalizedUrl = withoutSearch(request);
  if (!PRECACHE_URLS.has(normalizedUrl)) return;
  const mustRevalidate = request.cache === 'no-store'
    || url.searchParams.has('build')
    || (url.searchParams.has('v') && !requestsCurrentRevision(url, normalizedUrl));
  event.respondWith(mustRevalidate
    ? networkFirst(request, normalizedUrl)
    : cacheFirstAndFill(request, normalizedUrl));
});

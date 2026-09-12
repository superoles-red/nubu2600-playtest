const PRECACHE_ENTRIES = [
  {
    "url": "./build-manifest.json",
    "revision": "91390f7bf163112e"
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
    "revision": "9c61d7f19101722b"
  },
  {
    "url": "./campaign/ep1/ep1-02-easy.level.json",
    "revision": "828dfdbf6e193c21"
  },
  {
    "url": "./campaign/ep1/ep1-02-hard.level.json",
    "revision": "8edbf0a0971c5808"
  },
  {
    "url": "./campaign/ep1/ep1-02-medium.level.json",
    "revision": "3a19fae93d041130"
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
    "revision": "7b4faad2995de89f"
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
    "revision": "d4095ddf1e9485bb"
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
    "revision": "edf6f17a105d7963"
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
    "revision": "6045abbf99183def"
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
    "revision": "87f3f6533e3496b7"
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
    "revision": "42dc331b32acdee0"
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
    "revision": "0c79d477efec67b5"
  },
  {
    "url": "./campaign/ep1/ep1-22-hard.level.json",
    "revision": "2c58c2f6833c6422"
  },
  {
    "url": "./campaign/ep1/ep1-22-medium.level.json",
    "revision": "8bfd0e67e0143df0"
  },
  {
    "url": "./campaign/ep1/ep1-23-easy.level.json",
    "revision": "ffa515bdc99ddd93"
  },
  {
    "url": "./campaign/ep1/ep1-23-hard.level.json",
    "revision": "1e00b5039a7d786e"
  },
  {
    "url": "./campaign/ep1/ep1-23-medium.level.json",
    "revision": "7f7a655eae57b6c0"
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
    "revision": "1e90c776cd7deb26"
  },
  {
    "url": "./campaign/ep2/ep2-01-hard.level.json",
    "revision": "ee7f02f84de069d0"
  },
  {
    "url": "./campaign/ep2/ep2-01-medium.level.json",
    "revision": "0a40431a790a9216"
  },
  {
    "url": "./campaign/ep2/ep2-02-easy.level.json",
    "revision": "c260bb96969b3f6b"
  },
  {
    "url": "./campaign/ep2/ep2-02-hard.level.json",
    "revision": "7416e19cf3e28640"
  },
  {
    "url": "./campaign/ep2/ep2-02-medium.level.json",
    "revision": "5ef3a31bfc744146"
  },
  {
    "url": "./campaign/ep2/ep2-03-easy.level.json",
    "revision": "4a46b8d67aacaf28"
  },
  {
    "url": "./campaign/ep2/ep2-03-hard.level.json",
    "revision": "c3c32a45c41d54bc"
  },
  {
    "url": "./campaign/ep2/ep2-03-medium.level.json",
    "revision": "4a107b5e68dc8ac9"
  },
  {
    "url": "./campaign/ep2/ep2-04-easy.level.json",
    "revision": "8060c1fa0e4949fa"
  },
  {
    "url": "./campaign/ep2/ep2-04-hard.level.json",
    "revision": "5b23fbf2cf0e45b7"
  },
  {
    "url": "./campaign/ep2/ep2-04-medium.level.json",
    "revision": "e62d680ca52ebed7"
  },
  {
    "url": "./campaign/ep2/ep2-05-easy.level.json",
    "revision": "1b740fa365699f50"
  },
  {
    "url": "./campaign/ep2/ep2-05-hard.level.json",
    "revision": "bf8b2de78109bc16"
  },
  {
    "url": "./campaign/ep2/ep2-05-medium.level.json",
    "revision": "67f91f9006c09455"
  },
  {
    "url": "./campaign/ep2/ep2-06-easy.level.json",
    "revision": "409aae6b9c40f19b"
  },
  {
    "url": "./campaign/ep2/ep2-06-hard.level.json",
    "revision": "854fca0c745ebbeb"
  },
  {
    "url": "./campaign/ep2/ep2-06-medium.level.json",
    "revision": "4828ead1e20a1297"
  },
  {
    "url": "./campaign/ep2/ep2-07-easy.level.json",
    "revision": "c3f98080db065e6f"
  },
  {
    "url": "./campaign/ep2/ep2-07-hard.level.json",
    "revision": "2bf7d8feb73808d2"
  },
  {
    "url": "./campaign/ep2/ep2-07-medium.level.json",
    "revision": "316516f81b8c2aa4"
  },
  {
    "url": "./campaign/ep2/ep2-08-easy.level.json",
    "revision": "a01fb02f72349e14"
  },
  {
    "url": "./campaign/ep2/ep2-08-hard.level.json",
    "revision": "840389456a674d07"
  },
  {
    "url": "./campaign/ep2/ep2-08-medium.level.json",
    "revision": "01085dd8d64562e9"
  },
  {
    "url": "./campaign/ep2/ep2-09-easy.level.json",
    "revision": "8f49b40f5f24863d"
  },
  {
    "url": "./campaign/ep2/ep2-09-hard.level.json",
    "revision": "448a16bbab2b2954"
  },
  {
    "url": "./campaign/ep2/ep2-09-medium.level.json",
    "revision": "99f701924ca99477"
  },
  {
    "url": "./campaign/ep2/ep2-10-easy.level.json",
    "revision": "0390481f1e9a9480"
  },
  {
    "url": "./campaign/ep2/ep2-10-hard.level.json",
    "revision": "ec107180a710831f"
  },
  {
    "url": "./campaign/ep2/ep2-10-medium.level.json",
    "revision": "17fe0f1225e4f3ac"
  },
  {
    "url": "./campaign/ep2/ep2-11-easy.level.json",
    "revision": "9525c9199a2207dd"
  },
  {
    "url": "./campaign/ep2/ep2-11-hard.level.json",
    "revision": "5ccf705d732bf91f"
  },
  {
    "url": "./campaign/ep2/ep2-11-medium.level.json",
    "revision": "06f8343b0b44c693"
  },
  {
    "url": "./campaign/ep2/ep2-12-easy.level.json",
    "revision": "f757fc15c1f8c118"
  },
  {
    "url": "./campaign/ep2/ep2-12-hard.level.json",
    "revision": "a097e216054096a2"
  },
  {
    "url": "./campaign/ep2/ep2-12-medium.level.json",
    "revision": "4a4b6baa4dea64fe"
  },
  {
    "url": "./campaign/ep2/ep2-13-easy.level.json",
    "revision": "3f251bc97e6f5963"
  },
  {
    "url": "./campaign/ep2/ep2-13-hard.level.json",
    "revision": "e98fd1881234f836"
  },
  {
    "url": "./campaign/ep2/ep2-13-medium.level.json",
    "revision": "e6c8296ec7181fed"
  },
  {
    "url": "./campaign/ep2/ep2-14-easy.level.json",
    "revision": "bef08bb933a7274e"
  },
  {
    "url": "./campaign/ep2/ep2-14-hard.level.json",
    "revision": "c4893f1f6481522d"
  },
  {
    "url": "./campaign/ep2/ep2-14-medium.level.json",
    "revision": "9f60a77bcd85ce67"
  },
  {
    "url": "./campaign/ep2/ep2-15-easy.level.json",
    "revision": "bb0dc07c4a6a654f"
  },
  {
    "url": "./campaign/ep2/ep2-15-hard.level.json",
    "revision": "a5f3b5014a36dddc"
  },
  {
    "url": "./campaign/ep2/ep2-15-medium.level.json",
    "revision": "f22aa83fb2327941"
  },
  {
    "url": "./campaign/ep2/ep2-16-easy.level.json",
    "revision": "81f67973236a4e22"
  },
  {
    "url": "./campaign/ep2/ep2-16-hard.level.json",
    "revision": "314223ce6e96c299"
  },
  {
    "url": "./campaign/ep2/ep2-16-medium.level.json",
    "revision": "065d9929ee0d636c"
  },
  {
    "url": "./campaign/ep2/ep2-17-easy.level.json",
    "revision": "6b90f9fa358b785c"
  },
  {
    "url": "./campaign/ep2/ep2-17-hard.level.json",
    "revision": "77c1d5dee118a688"
  },
  {
    "url": "./campaign/ep2/ep2-17-medium.level.json",
    "revision": "0067d2ef6f3dfd1e"
  },
  {
    "url": "./campaign/ep2/ep2-18-easy.level.json",
    "revision": "5f12d0051ae53b4f"
  },
  {
    "url": "./campaign/ep2/ep2-18-hard.level.json",
    "revision": "0da3b698ee3c6c25"
  },
  {
    "url": "./campaign/ep2/ep2-18-medium.level.json",
    "revision": "ac9c4cfcd5d334bb"
  },
  {
    "url": "./campaign/ep2/ep2-19-easy.level.json",
    "revision": "c6720ad8308dbbe3"
  },
  {
    "url": "./campaign/ep2/ep2-19-hard.level.json",
    "revision": "cd07a6ccb9d02efc"
  },
  {
    "url": "./campaign/ep2/ep2-19-medium.level.json",
    "revision": "9cf43232e6af05e9"
  },
  {
    "url": "./campaign/ep2/ep2-20-easy.level.json",
    "revision": "9c7fcfeaa8376a9d"
  },
  {
    "url": "./campaign/ep2/ep2-20-hard.level.json",
    "revision": "73c024bbf75b8e2a"
  },
  {
    "url": "./campaign/ep2/ep2-20-medium.level.json",
    "revision": "f503b7fcd240319b"
  },
  {
    "url": "./campaign/ep2/ep2-21-easy.level.json",
    "revision": "e67db791bacf2858"
  },
  {
    "url": "./campaign/ep2/ep2-21-hard.level.json",
    "revision": "03fe4586434953d4"
  },
  {
    "url": "./campaign/ep2/ep2-21-medium.level.json",
    "revision": "2515d6eb94e5b00a"
  },
  {
    "url": "./campaign/ep2/ep2-22-easy.level.json",
    "revision": "4098d6dc0ae9e539"
  },
  {
    "url": "./campaign/ep2/ep2-22-hard.level.json",
    "revision": "80a73b54a08004a3"
  },
  {
    "url": "./campaign/ep2/ep2-22-medium.level.json",
    "revision": "e8c706897aab825f"
  },
  {
    "url": "./campaign/ep2/ep2-23-easy.level.json",
    "revision": "04bdd2f971867a44"
  },
  {
    "url": "./campaign/ep2/ep2-23-hard.level.json",
    "revision": "de4b0b67392ed634"
  },
  {
    "url": "./campaign/ep2/ep2-23-medium.level.json",
    "revision": "249a540d48a37df8"
  },
  {
    "url": "./campaign/ep2/ep2-24-easy.level.json",
    "revision": "52247566dfa344fd"
  },
  {
    "url": "./campaign/ep2/ep2-24-hard.level.json",
    "revision": "6c1bf814900d1446"
  },
  {
    "url": "./campaign/ep2/ep2-24-medium.level.json",
    "revision": "2e7c20b9535267f6"
  },
  {
    "url": "./campaign/lobby/lobby-01-easy.level.json",
    "revision": "ebe5aa9b74cd3a04"
  },
  {
    "url": "./campaign/lobby/lobby-02-easy.level.json",
    "revision": "67894014216f744a"
  },
  {
    "url": "./campaign/lobby/lobby-03-easy.level.json",
    "revision": "7d9ae8a29efc6624"
  },
  {
    "url": "./campaign/lobby/lobby-04-easy.level.json",
    "revision": "e0283738e88b1fb4"
  },
  {
    "url": "./campaign/lobby/lobby-05-easy.level.json",
    "revision": "e83e9ad19e84c33f"
  },
  {
    "url": "./campaign/lobby/lobby-06-easy.level.json",
    "revision": "48cf745365e07f7e"
  },
  {
    "url": "./campaign/lobby/lobby-07-easy.level.json",
    "revision": "13bedeb899c25e6d"
  },
  {
    "url": "./campaign/lobby/lobby-08-easy.level.json",
    "revision": "b161d08029169a1f"
  },
  {
    "url": "./campaign/lobby/lobby-09-easy.level.json",
    "revision": "90631581623fccf9"
  },
  {
    "url": "./campaign/lobby/lobby-10-easy.level.json",
    "revision": "590350dbb826ec97"
  },
  {
    "url": "./campaign/lobby/lobby-11-easy.level.json",
    "revision": "f8b4249f08033e58"
  },
  {
    "url": "./campaign/lobby/lobby-12-easy.level.json",
    "revision": "c303c5f03e54e928"
  },
  {
    "url": "./campaign/lobby/lobby-13-easy.level.json",
    "revision": "d097f3560be97b69"
  },
  {
    "url": "./campaign/lobby/lobby-14-easy.level.json",
    "revision": "467d0826af6cb0e5"
  },
  {
    "url": "./campaign/lobby/lobby-15-easy.level.json",
    "revision": "2430bb0951587935"
  },
  {
    "url": "./campaign/lobby/lobby-16-easy.level.json",
    "revision": "8f46861a81124c74"
  },
  {
    "url": "./campaign/lobby/lobby-17-easy.level.json",
    "revision": "163bf328e868a4a6"
  },
  {
    "url": "./campaign/lobby/lobby-18-easy.level.json",
    "revision": "4262dfb5bd815df3"
  },
  {
    "url": "./campaign/lobby/lobby-19-easy.level.json",
    "revision": "ca1dec950eaacda7"
  },
  {
    "url": "./campaign/lobby/lobby-20-easy.level.json",
    "revision": "17d8251d17ef9fb5"
  },
  {
    "url": "./campaign/lobby/lobby-21-easy.level.json",
    "revision": "0398b87f96b756cf"
  },
  {
    "url": "./campaign/lobby/lobby-22-easy.level.json",
    "revision": "93d1df94af23ed9c"
  },
  {
    "url": "./campaign/lobby/lobby-23-easy.level.json",
    "revision": "00b77480ae34a4a7"
  },
  {
    "url": "./campaign/lobby/lobby-24-easy.level.json",
    "revision": "017efeed045b7a67"
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
    "revision": "9c61d7f19101722b"
  },
  {
    "url": "./editor/campaign/ep1/ep1-02-easy.level.json",
    "revision": "828dfdbf6e193c21"
  },
  {
    "url": "./editor/campaign/ep1/ep1-02-hard.level.json",
    "revision": "8edbf0a0971c5808"
  },
  {
    "url": "./editor/campaign/ep1/ep1-02-medium.level.json",
    "revision": "3a19fae93d041130"
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
    "revision": "7b4faad2995de89f"
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
    "revision": "d4095ddf1e9485bb"
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
    "revision": "edf6f17a105d7963"
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
    "revision": "6045abbf99183def"
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
    "revision": "87f3f6533e3496b7"
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
    "revision": "42dc331b32acdee0"
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
    "revision": "0c79d477efec67b5"
  },
  {
    "url": "./editor/campaign/ep1/ep1-22-hard.level.json",
    "revision": "2c58c2f6833c6422"
  },
  {
    "url": "./editor/campaign/ep1/ep1-22-medium.level.json",
    "revision": "8bfd0e67e0143df0"
  },
  {
    "url": "./editor/campaign/ep1/ep1-23-easy.level.json",
    "revision": "ffa515bdc99ddd93"
  },
  {
    "url": "./editor/campaign/ep1/ep1-23-hard.level.json",
    "revision": "1e00b5039a7d786e"
  },
  {
    "url": "./editor/campaign/ep1/ep1-23-medium.level.json",
    "revision": "7f7a655eae57b6c0"
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
    "revision": "1e90c776cd7deb26"
  },
  {
    "url": "./editor/campaign/ep2/ep2-01-hard.level.json",
    "revision": "ee7f02f84de069d0"
  },
  {
    "url": "./editor/campaign/ep2/ep2-01-medium.level.json",
    "revision": "0a40431a790a9216"
  },
  {
    "url": "./editor/campaign/ep2/ep2-02-easy.level.json",
    "revision": "c260bb96969b3f6b"
  },
  {
    "url": "./editor/campaign/ep2/ep2-02-hard.level.json",
    "revision": "7416e19cf3e28640"
  },
  {
    "url": "./editor/campaign/ep2/ep2-02-medium.level.json",
    "revision": "5ef3a31bfc744146"
  },
  {
    "url": "./editor/campaign/ep2/ep2-03-easy.level.json",
    "revision": "4a46b8d67aacaf28"
  },
  {
    "url": "./editor/campaign/ep2/ep2-03-hard.level.json",
    "revision": "c3c32a45c41d54bc"
  },
  {
    "url": "./editor/campaign/ep2/ep2-03-medium.level.json",
    "revision": "4a107b5e68dc8ac9"
  },
  {
    "url": "./editor/campaign/ep2/ep2-04-easy.level.json",
    "revision": "8060c1fa0e4949fa"
  },
  {
    "url": "./editor/campaign/ep2/ep2-04-hard.level.json",
    "revision": "5b23fbf2cf0e45b7"
  },
  {
    "url": "./editor/campaign/ep2/ep2-04-medium.level.json",
    "revision": "e62d680ca52ebed7"
  },
  {
    "url": "./editor/campaign/ep2/ep2-05-easy.level.json",
    "revision": "1b740fa365699f50"
  },
  {
    "url": "./editor/campaign/ep2/ep2-05-hard.level.json",
    "revision": "bf8b2de78109bc16"
  },
  {
    "url": "./editor/campaign/ep2/ep2-05-medium.level.json",
    "revision": "67f91f9006c09455"
  },
  {
    "url": "./editor/campaign/ep2/ep2-06-easy.level.json",
    "revision": "409aae6b9c40f19b"
  },
  {
    "url": "./editor/campaign/ep2/ep2-06-hard.level.json",
    "revision": "854fca0c745ebbeb"
  },
  {
    "url": "./editor/campaign/ep2/ep2-06-medium.level.json",
    "revision": "4828ead1e20a1297"
  },
  {
    "url": "./editor/campaign/ep2/ep2-07-easy.level.json",
    "revision": "c3f98080db065e6f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-07-hard.level.json",
    "revision": "2bf7d8feb73808d2"
  },
  {
    "url": "./editor/campaign/ep2/ep2-07-medium.level.json",
    "revision": "316516f81b8c2aa4"
  },
  {
    "url": "./editor/campaign/ep2/ep2-08-easy.level.json",
    "revision": "a01fb02f72349e14"
  },
  {
    "url": "./editor/campaign/ep2/ep2-08-hard.level.json",
    "revision": "840389456a674d07"
  },
  {
    "url": "./editor/campaign/ep2/ep2-08-medium.level.json",
    "revision": "01085dd8d64562e9"
  },
  {
    "url": "./editor/campaign/ep2/ep2-09-easy.level.json",
    "revision": "8f49b40f5f24863d"
  },
  {
    "url": "./editor/campaign/ep2/ep2-09-hard.level.json",
    "revision": "448a16bbab2b2954"
  },
  {
    "url": "./editor/campaign/ep2/ep2-09-medium.level.json",
    "revision": "99f701924ca99477"
  },
  {
    "url": "./editor/campaign/ep2/ep2-10-easy.level.json",
    "revision": "0390481f1e9a9480"
  },
  {
    "url": "./editor/campaign/ep2/ep2-10-hard.level.json",
    "revision": "ec107180a710831f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-10-medium.level.json",
    "revision": "17fe0f1225e4f3ac"
  },
  {
    "url": "./editor/campaign/ep2/ep2-11-easy.level.json",
    "revision": "9525c9199a2207dd"
  },
  {
    "url": "./editor/campaign/ep2/ep2-11-hard.level.json",
    "revision": "5ccf705d732bf91f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-11-medium.level.json",
    "revision": "06f8343b0b44c693"
  },
  {
    "url": "./editor/campaign/ep2/ep2-12-easy.level.json",
    "revision": "f757fc15c1f8c118"
  },
  {
    "url": "./editor/campaign/ep2/ep2-12-hard.level.json",
    "revision": "a097e216054096a2"
  },
  {
    "url": "./editor/campaign/ep2/ep2-12-medium.level.json",
    "revision": "4a4b6baa4dea64fe"
  },
  {
    "url": "./editor/campaign/ep2/ep2-13-easy.level.json",
    "revision": "3f251bc97e6f5963"
  },
  {
    "url": "./editor/campaign/ep2/ep2-13-hard.level.json",
    "revision": "e98fd1881234f836"
  },
  {
    "url": "./editor/campaign/ep2/ep2-13-medium.level.json",
    "revision": "e6c8296ec7181fed"
  },
  {
    "url": "./editor/campaign/ep2/ep2-14-easy.level.json",
    "revision": "bef08bb933a7274e"
  },
  {
    "url": "./editor/campaign/ep2/ep2-14-hard.level.json",
    "revision": "c4893f1f6481522d"
  },
  {
    "url": "./editor/campaign/ep2/ep2-14-medium.level.json",
    "revision": "9f60a77bcd85ce67"
  },
  {
    "url": "./editor/campaign/ep2/ep2-15-easy.level.json",
    "revision": "bb0dc07c4a6a654f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-15-hard.level.json",
    "revision": "a5f3b5014a36dddc"
  },
  {
    "url": "./editor/campaign/ep2/ep2-15-medium.level.json",
    "revision": "f22aa83fb2327941"
  },
  {
    "url": "./editor/campaign/ep2/ep2-16-easy.level.json",
    "revision": "81f67973236a4e22"
  },
  {
    "url": "./editor/campaign/ep2/ep2-16-hard.level.json",
    "revision": "314223ce6e96c299"
  },
  {
    "url": "./editor/campaign/ep2/ep2-16-medium.level.json",
    "revision": "065d9929ee0d636c"
  },
  {
    "url": "./editor/campaign/ep2/ep2-17-easy.level.json",
    "revision": "6b90f9fa358b785c"
  },
  {
    "url": "./editor/campaign/ep2/ep2-17-hard.level.json",
    "revision": "77c1d5dee118a688"
  },
  {
    "url": "./editor/campaign/ep2/ep2-17-medium.level.json",
    "revision": "0067d2ef6f3dfd1e"
  },
  {
    "url": "./editor/campaign/ep2/ep2-18-easy.level.json",
    "revision": "5f12d0051ae53b4f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-18-hard.level.json",
    "revision": "0da3b698ee3c6c25"
  },
  {
    "url": "./editor/campaign/ep2/ep2-18-medium.level.json",
    "revision": "ac9c4cfcd5d334bb"
  },
  {
    "url": "./editor/campaign/ep2/ep2-19-easy.level.json",
    "revision": "c6720ad8308dbbe3"
  },
  {
    "url": "./editor/campaign/ep2/ep2-19-hard.level.json",
    "revision": "cd07a6ccb9d02efc"
  },
  {
    "url": "./editor/campaign/ep2/ep2-19-medium.level.json",
    "revision": "9cf43232e6af05e9"
  },
  {
    "url": "./editor/campaign/ep2/ep2-20-easy.level.json",
    "revision": "9c7fcfeaa8376a9d"
  },
  {
    "url": "./editor/campaign/ep2/ep2-20-hard.level.json",
    "revision": "73c024bbf75b8e2a"
  },
  {
    "url": "./editor/campaign/ep2/ep2-20-medium.level.json",
    "revision": "f503b7fcd240319b"
  },
  {
    "url": "./editor/campaign/ep2/ep2-21-easy.level.json",
    "revision": "e67db791bacf2858"
  },
  {
    "url": "./editor/campaign/ep2/ep2-21-hard.level.json",
    "revision": "03fe4586434953d4"
  },
  {
    "url": "./editor/campaign/ep2/ep2-21-medium.level.json",
    "revision": "2515d6eb94e5b00a"
  },
  {
    "url": "./editor/campaign/ep2/ep2-22-easy.level.json",
    "revision": "4098d6dc0ae9e539"
  },
  {
    "url": "./editor/campaign/ep2/ep2-22-hard.level.json",
    "revision": "80a73b54a08004a3"
  },
  {
    "url": "./editor/campaign/ep2/ep2-22-medium.level.json",
    "revision": "e8c706897aab825f"
  },
  {
    "url": "./editor/campaign/ep2/ep2-23-easy.level.json",
    "revision": "04bdd2f971867a44"
  },
  {
    "url": "./editor/campaign/ep2/ep2-23-hard.level.json",
    "revision": "de4b0b67392ed634"
  },
  {
    "url": "./editor/campaign/ep2/ep2-23-medium.level.json",
    "revision": "249a540d48a37df8"
  },
  {
    "url": "./editor/campaign/ep2/ep2-24-easy.level.json",
    "revision": "52247566dfa344fd"
  },
  {
    "url": "./editor/campaign/ep2/ep2-24-hard.level.json",
    "revision": "6c1bf814900d1446"
  },
  {
    "url": "./editor/campaign/ep2/ep2-24-medium.level.json",
    "revision": "2e7c20b9535267f6"
  },
  {
    "url": "./editor/campaign/lobby/lobby-01-easy.level.json",
    "revision": "ebe5aa9b74cd3a04"
  },
  {
    "url": "./editor/campaign/lobby/lobby-02-easy.level.json",
    "revision": "67894014216f744a"
  },
  {
    "url": "./editor/campaign/lobby/lobby-03-easy.level.json",
    "revision": "7d9ae8a29efc6624"
  },
  {
    "url": "./editor/campaign/lobby/lobby-04-easy.level.json",
    "revision": "e0283738e88b1fb4"
  },
  {
    "url": "./editor/campaign/lobby/lobby-05-easy.level.json",
    "revision": "e83e9ad19e84c33f"
  },
  {
    "url": "./editor/campaign/lobby/lobby-06-easy.level.json",
    "revision": "48cf745365e07f7e"
  },
  {
    "url": "./editor/campaign/lobby/lobby-07-easy.level.json",
    "revision": "13bedeb899c25e6d"
  },
  {
    "url": "./editor/campaign/lobby/lobby-08-easy.level.json",
    "revision": "b161d08029169a1f"
  },
  {
    "url": "./editor/campaign/lobby/lobby-09-easy.level.json",
    "revision": "90631581623fccf9"
  },
  {
    "url": "./editor/campaign/lobby/lobby-10-easy.level.json",
    "revision": "590350dbb826ec97"
  },
  {
    "url": "./editor/campaign/lobby/lobby-11-easy.level.json",
    "revision": "f8b4249f08033e58"
  },
  {
    "url": "./editor/campaign/lobby/lobby-12-easy.level.json",
    "revision": "c303c5f03e54e928"
  },
  {
    "url": "./editor/campaign/lobby/lobby-13-easy.level.json",
    "revision": "d097f3560be97b69"
  },
  {
    "url": "./editor/campaign/lobby/lobby-14-easy.level.json",
    "revision": "467d0826af6cb0e5"
  },
  {
    "url": "./editor/campaign/lobby/lobby-15-easy.level.json",
    "revision": "2430bb0951587935"
  },
  {
    "url": "./editor/campaign/lobby/lobby-16-easy.level.json",
    "revision": "8f46861a81124c74"
  },
  {
    "url": "./editor/campaign/lobby/lobby-17-easy.level.json",
    "revision": "163bf328e868a4a6"
  },
  {
    "url": "./editor/campaign/lobby/lobby-18-easy.level.json",
    "revision": "4262dfb5bd815df3"
  },
  {
    "url": "./editor/campaign/lobby/lobby-19-easy.level.json",
    "revision": "ca1dec950eaacda7"
  },
  {
    "url": "./editor/campaign/lobby/lobby-20-easy.level.json",
    "revision": "17d8251d17ef9fb5"
  },
  {
    "url": "./editor/campaign/lobby/lobby-21-easy.level.json",
    "revision": "0398b87f96b756cf"
  },
  {
    "url": "./editor/campaign/lobby/lobby-22-easy.level.json",
    "revision": "93d1df94af23ed9c"
  },
  {
    "url": "./editor/campaign/lobby/lobby-23-easy.level.json",
    "revision": "00b77480ae34a4a7"
  },
  {
    "url": "./editor/campaign/lobby/lobby-24-easy.level.json",
    "revision": "017efeed045b7a67"
  },
  {
    "url": "./editor/editor.js",
    "revision": "d8f044b2d92ced34"
  },
  {
    "url": "./editor/index.html",
    "revision": "276678b1f3d5f06a"
  },
  {
    "url": "./editor/nubu-level.schema.json",
    "revision": "181f76254ef84863"
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
    "revision": "19f11db74a8e5d9d"
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
const CACHE_NAME = `${CACHE_PREFIX}9bac1664611dbc90`;
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

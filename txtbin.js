/*!
 * Text/Binary Editor
 * Copyright 2023 Takashi Harano
 * Released under the MIT license
 * https://github.com/takashiharano/text-binary-editor
 */
var txtbin = {};
txtbin.TXT_CHR_LF = '|';
txtbin.TXT_CHR_CR = '_';

txtbin.CHR_NULL = '<span style="color:#048" class="cc" data-tooltip="NULL">.</span>';
txtbin.CHR_CTRL = '<span style="color:#888" class="cc" data-tooltip="CTRL">.</span>';
txtbin.CHR_CRLF = '&#x21b5;';
txtbin.CHR_LF = '&#x2193;';
txtbin.CHR_CR = '&#x2190;';
txtbin.CHR_CRLF_S = '<span style="color:#0cf" class="cc">' + txtbin.CHR_CRLF + '</span>';
txtbin.CHR_LF_S = '<span style="color:#80d860" class="cc">' + txtbin.CHR_LF + '</span>';
txtbin.CHR_CR_S = '<span style="color:#f41" class="cc">' + txtbin.CHR_CR + '</span>';
txtbin.TAB = '<span style="color:#cc2" class="cc" data-tooltip="Tab">&gt;</span>';
txtbin.CHR_ESC = '<span style="color:#c80" class="cc" data-tooltip="ESC">.</span>';
txtbin.SP = '<span style="color:#099" class="cc" data-tooltip="Space">.</span>';
txtbin.CHR_DELL = '<span style="color:#800" class="cc" data-tooltip="DELL">.</span>';
txtbin.NBSP = '<span style="color:#ff5354" class="cc cc-link" data-tooltip="U+00A0: Non-breaking space" onclick="txtbin.openUnicodeTable(\'0x00A0\', true);">.</span>';
txtbin.CDM = '<span style="color:#fe0" class="cc2 cc-link" onclick="txtbin.openUnicodeTable(\'0x0300\');">[CDM]</span>';
txtbin.ZWSP = '<span style="color:#f8f" class="cc2 cc-link" data-tooltip="U+200B: Zero-width space" onclick="txtbin.openUnicodeTable(\'0x200B\', true);">[ZWSP]</span>';
txtbin.LRM = '<span style="color:#f80" class="cc2 cc-link" data-tooltip="U+200E: Left-to-Right Mark" onclick="txtbin.openUnicodeTable(\'0x200E\', true);">[LRM]</span>';
txtbin.RLM = '<span style="color:#f80" class="cc2 cc-link" data-tooltip="U+200F: Right-to-Left Mark" onclick="txtbin.openUnicodeTable(\'0x200F\', true);">[RLM]</span>';
txtbin.LRE = '<span style="color:#f80" class="cc2 cc-link" data-tooltip="U+202A: Left-to-Right Embedding" onclick="txtbin.openUnicodeTable(\'0x202A\', true);">[LRE]</span>';
txtbin.RLE = '<span style="color:#f80" class="cc2 cc-link" data-tooltip="U+202B: Right-to-Left Embedding" onclick="txtbin.openUnicodeTable(\'0x202B\', true);">[RLE]</span>';
txtbin.PDF = '<span style="color:#f80" class="cc2 cc-link" data-tooltip="U+202C: Pop Directional Formatting" onclick="txtbin.openUnicodeTable(\'0x202C\', true);">[PDF]</span>';
txtbin.LRO = '<span style="color:#f80" class="cc2 cc-link" data-tooltip="U+202D: Left-to-Right Override" onclick="txtbin.openUnicodeTable(\'0x202D\', true);">[LRO]</span>';
txtbin.RLO = '<span style="color:#f80" class="cc2 cc-link" data-tooltip="U+202E: Right-to-Left Override" onclick="txtbin.openUnicodeTable(\'0x202E\', true);">[RLO]</span>';
txtbin.FULL_SP = '<span style="color:#05d" class="cc" data-tooltip="IDEOGRAPHIC SPACE">・</span>';
txtbin.VS = '<span style="color:#fe0" class="cc2 cc-link" data-tooltip="U+FE00-U+FE0F: Variation Selectors" onclick="txtbin.openUnicodeTable(\'0xFE00\');">[VS]</span>';
txtbin.BOM = '<span style="color:#fb6" class="cc2 cc-link" data-tooltip="U+FEFF: BOM" onclick="txtbin.openUnicodeTable(\'0xFEFF\', true);">.</span>';
txtbin.EOF = '<span style="color:#08f" class="cc">[EOF]</span>';

txtbin.DEFAULT_FONT_SIZE = 14;
txtbin.DEFAULT_MODE = 'auto';
txtbin.DEFAULT_MODE_ACTIVE = 'hex';

txtbin.UI_ST_NONE = 0;
txtbin.UI_ST_AREA_RESIZING_X = 1;
txtbin.UI_ST_AREA_RESIZING_Y = 1 << 1;
txtbin.UI_ST_DRAGGING = 1 << 2;

txtbin.CHARACTER_ENCODINGS = {
  'ascii': {name: 'ASCII', color: '#cff'},
  'utf8': {name: 'UTF-8', color: '#fb6'},
  'utf16': {name: 'UTF-16', color: '#bcf'},
  'utf16le': {name: 'UTF-16LE', color: '#bcf'},
  'utf16be': {name: 'UTF-16BE', color: '#bcf'},
  'iso2022jp': {name: 'ISO-2022-JP', color: '#fce'},
  'sjis': {name: 'Shift_JIS', color: '#8df'},
  'euc_jp': {name: 'EUC-JP', color: '#cf8'},
};

txtbin.FILETYPES = {
  'accdb': {'head': '00 01 00 00 53 74 61 6E 64 61 72 64 20 41 43 45 20 44 42', 'mime': 'application/msaccess', 'ext': 'accdb'},
  'avif': {'head': 'xx xx xx xx 66 74 79 70 61 76 69 66', 'mime': 'image/avif', 'ext': 'avif'},
  'bmp': {'head': '42 4D', 'mime': 'image/bmp', 'ext': 'bmp'},
  'cab': {'head': '4D 53 43 46 00 00 00 00', 'mime': 'application/vnd.ms-cab-compressed', 'ext': 'cab'},
  'class': {'head': 'CA FE BA BE', 'mime': 'application/octet-stream', 'ext': 'class'},
  'cur': {'head': '00 00 02', 'mime': 'image/vnd.microsoft.icon', 'ext': 'cur'},
  'elf': {'name': 'ELF', 'head': '7F 45 4C 46', 'mime': 'application/octet-stream', 'ext': 'o'},
  'eps': {'head': 'C5 D0 D3 C6', 'mime': 'application/postscript', 'ext': 'eps'},
  'exe': {'head': '4D 5A', 'mime': 'application/x-msdownload', 'ext': 'exe'},
  'gif': {'head': '47 49 46 38', 'mime': 'image/gif', 'ext': 'gif'},
  'gz': {'head': '1F 8B', 'mime': 'application/gzip', 'ext': 'gz'},
  'html': {'head': '3C 21 44 4F 43 54 59 50 45 20 68 74 6D 6C', 'mime': 'text/html', 'ext': 'html'},
  'ico': {'head': '00 00 01', 'mime': 'image/x-icon', 'ext': 'ico'},
  'jpg': {'head': 'FF D8', 'mime': 'image/jpeg', 'ext': 'jpg'},
  'lzh': {'head': 'xx xx 2D 6C 68 xx 2D', 'mime': 'application/octet-stream', 'ext': 'lzh'},
  'mid': {'head': '4D 54 68 64', 'mime': 'audio/midi', 'ext': 'mid', 'nopreview': 1},
  'mov': {'head': 'xx xx xx xx 6D 6F 6F 76', 'mime': 'video/quicktime', 'ext': 'mov'},
  'mp3': {'head': ['FF FA', 'FF FB', '49 44 33'], 'mime': 'audio/mpeg', 'ext': 'mp3'},
  'mp4': {'head': ['xx xx xx xx 66 74 79 70 6D 70 34', 'xx xx xx xx 66 74 79 70 69 73 6F 6D'], 'mime': 'video/mp4', 'ext': 'mp4'},
  'mpg': {'head': '00 00 01 BA', 'mime': 'video/mpeg', 'ext': 'mpg', 'nopreview': 1},
  'ole2': {'name': 'OLE2', 'head': 'D0 CF 11 E0 A1 B1 1A E1', 'mime': 'application/octet-stream', 'ext': 'office'},
  'pdf': {'head': '25 50 44 46 2D', 'mime': 'application/pdf', 'ext': 'pdf'},
  'png': {'head': '89 50 4E 47 0D 0A 1A 0A 00', 'mime': 'image/png', 'ext': 'png'},
  'svg': {'head': '3C 73 76 67 20', 'mime': 'image/svg+xml', 'ext': 'svg'},
  'txt_utf8_bom': {'head': 'EF BB BF', 'mime': 'text/plain', 'ext': 'txt', 'encoding': 'utf8_bom'},
  'txt_utf16be_bom': {'head': 'FE FF', 'mime': 'text/plain', 'ext': 'txt', 'encoding': 'utf16be_bom'},
  'txt_utf16le_bom': {'head': 'FF FE', 'mime': 'text/plain', 'ext': 'txt', 'encoding': 'utf16le_bom'},
  'wav': {'head': '52 49 46 46 xx xx xx xx 57 41 56 45 66 6D 74', 'mime': 'audio/wav', 'ext': 'wav'},
  'webp': {'head': '52 49 46 46 xx xx xx xx 57 45 42 50', 'mime': 'image/webp', 'ext': 'webp'},
  'xml': {'head': '3C 3F 78 6D 6C 20', 'mime': 'text/xml', 'ext': 'xml'},
  'zip': {'head': '50 4B 03 04', 'mime': 'application/x-zip-compressed', 'ext': 'zip'},
  'xlsx': {'hexptn': '77 6F 72 6B 62 6F 6F 6B 2E 78 6D 6C', 'mime': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', 'ext': 'xlsx', 'supertype': 'zip'},
  'docx': {'hexptn': '77 6F 72 64 2F 64 6F 63 75 6D 65 6E 74 2E 78 6D 6C', 'mime': 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', 'ext': 'docx', 'supertype': 'zip'},
  'pptx': {'hexptn': '70 70 74 2F 70 72 65 73 65 6E 74 61 74 69 6F 6E 2E 78 6D 6C', 'mime': 'application/vnd.openxmlformats-officedocument.presentationml.presentation', 'ext': 'pptx', 'supertype': 'zip'},
  'war': {'hexptn': '57 45 42 2D 49 4E 46 2F', 'mime': 'application/x-zip', 'ext': 'war', 'supertype': 'zip'},
  'jar': {'hexptn': '4D 45 54 41 2D 49 4E 46 2F', 'mime': 'application/java-archive', 'ext': 'jar', 'supertype': 'zip'}
};

txtbin.CODE_BLOCKS = [
  {
    name: 'bmp',
    fullname: 'Basic Multilingual Plane',
    label: 'U+0000-U+FFFF   ',
    block_level: 0,
    ranges: [
      {
        cp_s: 0x0000,
        cp_e: 0xFFFF
      }
    ],
    skip_check: true
  },
  {
    name: 'ascii',
    fullname: 'ASCII',
    label: 'A',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x0000,
        cp_e: 0x007F,
        utf16_s: 0x0020,
        utf16_e: 0x007F,
        utf8_s: 0x20,
        utf8_e: 0x7F
      }
    ]
  },
  {
    name: 'tab',
    fullname: 'Horizontal Tabulation',
    label: 'TAB',
    ranges: [
      {
        cp_s: 0x0009,
        utf16_s: 0x0009,
        utf8_s: 0x09
      }
    ]
  },
  {
    name: 'sp',
    fullname: 'Space',
    label: 'SP',
    ranges: [
      {
        cp_s: 0x0020,
        utf16_s: 0x0020,
        utf8_s: 0x20
      }
    ]
  },
  {
    name: 'latin1_suppl',
    fullname: 'Latin-1 Supplement',
    label: 'Ü',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x0080,
        cp_e: 0x00FF,
        utf16_s: 0x0080,
        utf16_e: 0x00FF
      }
    ]
  },
  {
    name: 'nbsp',
    fullname: 'Non-breaking space',
    label: 'NBSP',
    ranges: [
      {
        cp_s: 0x00A0,
        utf16_s: 0x00A0,
        utf8_s: 0xC2A0
      }
    ],
    caution: true
  },
  {
    name: 'cdm',
    fullname: 'Combining Diacritical Marks',
    label: 'CDM',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x0300,
        cp_e: 0x036F,
        utf16_s: 0x0300,
        utf16_e: 0x036F,
        utf8_s: 0xCAB0,
        utf8_e: 0xCDAF
      }
    ],
    caution: true
  },
  {
    name: 'thai',
    fullname: 'Thai',
    label: 'ไทย',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x0E00,
        cp_e: 0x0E7F,
        utf16_s: 0x0E00,
        utf16_e: 0x0E7F,
        utf8_s: 0xE0B880,
        utf8_e: 0xE0B9BF
      }
    ]
  },
  {
    name: 'symbols',
    fullname: 'Symbols',
    label: '☆',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x2000,
        cp_e: 0x2BFF,
        utf16_s: 0x2000,
        utf16_e: 0x2BFF,
        utf8_s: 0xE28080,
        utf8_e: 0xE2AFBF
      }
    ]
  },
  {
    name: 'zwsp',
    fullname: 'Zero-width space',
    label: 'ZWSP',
    ranges: [
      {
        cp_s: 0x200B,
        utf16_s: 0x200B,
        utf8_s: 0xE2808B
      }
    ],
    caution: true
  },
  {
    name: 'bidi',
    fullname: 'Bidirectional',
    label: 'BiDi',
    block_level: 2,
    ranges: [
      {
        cp_s: 0x200E,
        cp_e: 0x200F,
        utf16_s: 0x200E,
        utf16_e: 0x200F,
        utf8_s: 0xE2808E,
        utf8_e: 0xE2808F
      },
      {
        cp_s: 0x202A,
        cp_e: 0x202E,
        utf16_s: 0x202A,
        utf16_e: 0x202E,
        utf8_s: 0xE280AA,
        utf8_e: 0xE280AE
      }
    ],
    caution: true
  },
  {
    name: 'full_space',
    fullname: 'Full-width space',
    label: 'ＳＰ',
    ranges: [
      {
        cp_s: 0x3000,
        utf16_s: 0x3000,
        utf8_s: 0xE38080
      }
    ]
  },
  {
    name: 'hiragana',
    fullname: 'Hiragana',
    label: 'あ',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x3040,
        cp_e: 0x3096,
        utf16_s: 0x3040,
        utf16_e: 0x3096,
        utf8_s: 0xE38181,
        utf8_e: 0xE38296
      }
    ]
  },
  {
    name: 'katakana',
    fullname: 'Katakana',
    label: 'ア',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x30A1,
        cp_e: 0x30FF,
        utf16_s: 0x30A1,
        utf16_e: 0x30FF,
        utf8_s: 0xE382A1,
        utf8_e: 0xE383BF
      }
    ]
  },
  {
    name: 'bopomofo',
    fullname: 'Bopomofo',
    label: 'ㄅ',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x3100,
        cp_e: 0x312F,
        utf16_s: 0x3100,
        utf16_e: 0x312F,
        utf8_s: 0xE38480,
        utf8_e: 0xE384AF
      }
    ]
  },
  {
    name: 'kanji',
    fullname: 'CJK unified ideographs',
    label: '漢',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x3400,
        cp_e: 0x9FFF,
        utf16_s: 0x3400,
        utf16_e: 0x9FFF,
        utf8_s: 0xE39080,
        utf8_e: 0xE9BFBF
      }
    ]
  },
  {
    name: 'i_number_zero',
    fullname: 'Ideographic Number Zero',
    label: '〇',
    ranges: [
      {
        cp_s: 0x3007,
        utf16_s: 0x3007,
        utf8_s: 0xE38087
      }
    ]
  },
  {
    name: 'hangul',
    fullname: 'Hangul',
    label: '한',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xAC00,
        cp_e: 0xD7AF,
        utf16_s: 0xAC00,
        utf16_e: 0xD7AF,
        utf8_s: 0xEAB080,
        utf8_e: 0xED9EAF
      }
    ]
  },
  {
    name: 'surrogates',
    fullname: 'Surrogates',
    label: 'SURR',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xD800,
        cp_e: 0xDFFF,
        utf16_s: 0xD800,
        utf16_e: 0xDFFF,
        utf8_s: 0xEFBFBD,
        utf8_e: 0xEFBFBD
      }
    ],
    caution: {
      utf8: true
    }
  },
  {
    name: 'pua',
    fullname: 'Private Use Area',
    label: 'PUA',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xE000,
        cp_e: 0xF8FF,
        utf16_s: 0xE000,
        utf16_e: 0xF8FF,
        utf8_s: 0xEE8080,
        utf8_e: 0xEFA3BF
      }
    ],
    caution: true
  },
  {
    name: 'kanji_comp',
    fullname: 'CJK Compatibility Ideographs',
    label: '漢2',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xF900,
        cp_e: 0xFAFF,
        utf16_s: 0xF900,
        utf16_e: 0xFAFF,
        utf8_s: 0xEFA480,
        utf8_e: 0xEFABBF
      }
    ]
  },
  {
    name: 'variation_selectors',
    fullname: 'Variation Selectors',
    label: 'VS',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xFE00,
        cp_e: 0xFE0F,
        utf16_s: 0xFE00,
        utf16_e: 0xFE0F,
        utf8_s: 0xEFB880,
        utf8_e: 0xEFB88F
      }
    ],
    caution: true
  },
  {
    name: 'fillwidth_forms',
    fullname: 'Fullwidth Forms',
    label: 'Ａ',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xFF00,
        cp_e: 0xFF5E,
        utf16_s: 0xFF00,
        utf16_e: 0xFF5E,
        utf8_s: 0xEFBC80,
        utf8_e: 0xEFBD9E
      }
    ]
  },
  {
    name: 'fillwidth_numbers',
    fullname: 'Fullwidth Numbers',
    label: '１',
    block_level: 2,
    ranges: [
      {
        cp_s: 0xFF10,
        cp_e: 0xFF19,
        utf16_s: 0xFF10,
        utf16_e: 0xFF19,
        utf8_s: 0xEFBC90,
        utf8_e: 0xEFBC99
      }
    ]
  },
  {
    name: 'half_kana',
    fullname: 'Halfwidth Kana',
    label: 'ｱ',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xFF61,
        cp_e: 0xFF9F,
        utf16_s: 0xFF61,
        utf16_e: 0xFF9F,
        utf8_s: 0xEFBDA1,
        utf8_e: 0xEFBE9F
      }
    ]
  },
  {
    name: 'non_bmp',
    label: 'U+10000-U+10FFFF',
    fullname: '4 bytes character',
    block_level: 0,
    ranges: [
      {
        cp_s: 0x10000,
        cp_e: 0x10FFFF
      }
    ],
    skip_check: true
  },
  {
    name: 'smp',
    fullname: 'Supplementary Multilingual Plane',
    label: '1:SMP',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x10000,
        cp_e: 0x1FFFF,
        utf16_s: 0xD800DC00,
        utf16_e: 0xD83FDFFF,
        utf8_s: 0xF0908080,
        utf8_e: 0xF09FBFBF
      }
    ]
  },
  {
    name: 'emoji',
    fullname: 'Emoji',
    label: 'Emoji',
    block_level: 2,
    ranges: [
      {
        cp_s: 0x1F300,
        cp_e: 0x1FBFF,
        utf16_s: 0xD83CDF00,
        utf16_e: 0xD83EDFFF,
        utf8_s: 0xF09F8C80,
        utf8_e: 0xF09FAFBF
      }
    ]
  },
  {
    name: 'sip',
    fullname: 'Supplementary Ideographic Plane',
    label: '2:SIP',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x20000,
        cp_e: 0x2FFFF,
        utf16_s: 0xD840DC00,
        utf16_e: 0xD87FDFFF,
        utf8_s: 0xF0A08080,
        utf8_e: 0xF0AFBFBF
      }
    ]
  },
  {
    name: 'tip',
    fullname: 'Tertiary Ideographic Plane',
    label: '3:TIP',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x30000,
        cp_e: 0x3FFFF,
        utf16_s: 0xD880DC00,
        utf16_e: 0xDB3FDFFF,
        utf8_s: 0xF0B08080,
        utf8_e: 0xF39FBFBF
      }
    ]
  },
  {
    name: 'p4_13',
    fullname: 'Plane 4 - Plane 13',
    label: '4-13',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x31350,
        cp_e: 0xDFFFF,
        utf16_s: 0xD884DF50,
        utf16_e: 0xDB3FDFFF,
        utf8_s: 0xF0B18D90,
        utf8_e: 0xF39FBFBF
      }
    ]
  },
  {
    name: 'ssp',
    fullname: 'Supplementary Special-purpose Plane',
    label: '14:SSP',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xE0000,
        cp_e: 0xEFFFF,
        utf16_s: 0xDB40DC00,
        utf16_e: 0xDB7FDFFF,
        utf8_s: 0xF3A08080,
        utf8_e: 0xF3AFBFBF
      }
    ]
  },
  {
    name: 'variation_selectors2',
    fullname: 'Variation Selector 17-256',
    label: 'VS2',
    block_level: 2,
    ranges: [
      {
        cp_s: 0xE0100,
        cp_e: 0xE01EF,
        utf16_s: 0xDB40DD00,
        utf16_e: 0xDB40DDEF,
        utf8_s: 0xF3A08480,
        utf8_e: 0xF3A087AF
      }
    ],
    caution: true
  },
  {
    name: 'pua15',
    fullname: 'Private Use Plane',
    label: '15:PUA',
    block_level: 1,
    ranges: [
      {
        cp_s: 0xF0000,
        cp_e: 0xFFFFF,
        utf16_s: 0xDB80DC00,
        utf16_e: 0xDBBFDFFF,
        utf8_s: 0xF3B08080,
        utf8_e: 0xF3BFBFBF
      }
    ]
  },
  {
    name: 'pua16',
    fullname: 'Private Use Plane',
    label: '16:PUA',
    block_level: 1,
    ranges: [
      {
        cp_s: 0x100000,
        cp_e: 0x10FFFF,
        utf16_s: 0xDBC0DC00,
        utf16_e: 0xDBFFDFFE,
        utf8_s: 0xF4808080,
        utf8_e: 0xF48FBFBF
      }
    ]
  }
];

txtbin.auto = true;
txtbin.bufCache = null;
txtbin.file = null;
txtbin.uiStatus = txtbin.UI_ST_NONE;
txtbin.areaSize = [
  {
    orgX: 0,
    orgY: 0,
    orgSP1: 0,
    orgSP2: 0,
    orgDW: 0,
    orgDH: 0,
    dW: 0,
    dH: 0
  },
  {
    orgX: 0,
    orgY: 0,
    orgSP1: 0,
    orgSP2: 0,
    orgDW: 0,
    orgDH: 0,
    dW: 0,
    dH: 0
  }
];
txtbin.mediaPreviewRect = null;
txtbin.orgSize = null;
txtbin.orgH = null;
txtbin.orgPos = {x: 0, y: 0};
txtbin.orgPrvScrl = null;
txtbin.prevWin = null;
txtbin.onselectstart = document.onselectstart;

$onReady = function() {
  util.clock('#clock');

  var opt = {
    mode: 'blob',
    onloadstart: txtbin.onDndLoadStart,
    onprogress: txtbin.onDndLoadProgress
  };
  txtbin.dndHandler = util.addDndHandler(document.body, txtbin.onDnd, opt);

  var mode = util.getQuery('mode');
  if (!mode) mode = txtbin.DEFAULT_MODE;
  txtbin.setMode(mode);
  if (mode == 'auto') {
    txtbin.activeMode(txtbin.DEFAULT_MODE_ACTIVE);
  }

  var fontSize = util.getQuery('fontsize') | 0;
  if (!fontSize) fontSize = txtbin.DEFAULT_FONT_SIZE;
  txtbin.setFontSize(fontSize);
  txtbin.setFontSize4Preview(fontSize);

  txtbin.storeAreaSize();
  window.addEventListener('mousemove', txtbin.onMouseMove, true);
  window.addEventListener('mouseup', txtbin.onMouseUp, true);
  $el('#adjuster-x').addEventListener('mousedown', txtbin.onAreaResizeStartX);
  $el('#adjuster-x').addEventListener('dblclick', txtbin.resetAreaSizeX);
  $el('#adjuster-y').addEventListener('mousedown', txtbin.onAreaResizeStartY);
  $el('#adjuster-y').addEventListener('dblclick', txtbin.resetAreaSizeY);

  $el('#dump-flag-show-addr').addEventListener('input', txtbin.onChangeDumpFlag);
  $el('#dump-flag-show-sp').addEventListener('input', txtbin.onChangeDumpFlag);
  $el('#dump-flag-show-ascii').addEventListener('input', txtbin.onChangeDumpFlag);
  $el('#dump-flag-uc').addEventListener('input', txtbin.onChangeDumpFlag);
  $el('#dump-multibyte').addEventListener('input', txtbin.onChangeDumpFlag);

  $el('#key').addEventListener('input', txtbin.onInputKey);
  $el('#key').addEventListener('change', txtbin.onInputKey);

  $el('#bsb64-n').addEventListener('change', txtbin.onChangeBsb64N);

  $el('#src').addEventListener('input', txtbin.onInput);
  $el('#src').addEventListener('change', txtbin.onInput);

  $el('#show-preview').addEventListener('change', txtbin.onChangeShowPreview);
  $el('#show-preview-rt').addEventListener('change', txtbin.onRealtimePreviewChange);
  $el('#show-preview-cc').addEventListener('change', txtbin.onChangeShowPreviewCc);
  $el('#word-wrap').addEventListener('change', txtbin.onChangeWordWrap);
  $el('#preview-mode').addEventListener('change', txtbin.onChangeShowPreview);
  $el('#preview-mode-encryption').addEventListener('change', txtbin.onChangeShowPreview);

  $el('#preview-wrapper').addEventListener('wheel', txtbin.onImgWheel);
  $el('#preview-wrapper').addEventListener('dblclick', txtbin.onPreviewDblClick);

  txtbin.initTxtEditMode();
  txtbin.clear();
};

txtbin.getMode = function() {
  return $el('#mode').value;
};

txtbin.isB64Mode = function() {
  var mode = txtbin.getMode();
  if ((mode == 'b64') || (mode == 'b64s') || (mode == 'bsb64')) {
    return true;
  }
  return false;
};

txtbin.switchRadix = function(mode, bufCache) {
  var buf = bufCache.buf;
  var b64 = bufCache.b64;
  var r;
  $el('#key-update-button').disabled = true;
  switch (mode) {
    case 'hex':
    case 'dec':
    case 'bin':
      r = txtbin.getBinDump(mode, buf);
      break;
    case 'b64s':
      var key = $el('#key').value;
      b64s = util.encodeBase64s(buf, key);
      r = txtbin.formatB64(b64s);
      if (txtbin.bufCache) {
        $el('#key-update-button').disabled = false;
      }
      break;
    case 'bsb64':
      var n = $el('#bsb64-n').value | 0;
      var b64s = util.BSB64.encode(buf, n);
      r = txtbin.formatB64(b64s);
      break;
    case 'txt':
      r = util.decodeBase64(b64);
      break;
    default:
      r = txtbin.formatB64(b64);
  }
  txtbin.setSrcValue(r, false);
};

txtbin.setMode = function(mode, onlyMode) {
  if (mode != 'auto') {
    txtbin.setDndHandlerMode(mode);
    var prevMode = $el('#mode').value;
    $el('#mode').value = mode;
    $el('.mode-ind').removeClass('mode-ind-active');
    $el('#mode-ind-' + mode).addClass('mode-ind-active');
    if (txtbin.bufCache) {
      if (prevMode != mode) {
        txtbin.switchRadix(mode, txtbin.bufCache);
      }
      if (txtbin.isB64Mode()) {
        txtbin.showPreview(txtbin.bufCache);
      }
    }
  }

  if (onlyMode) return;
  $el('.mode-button').removeClass('mode-active');
  $el('#mode-button-' + mode).addClass('mode-active');
  txtbin.auto = (mode == 'auto');
  if (mode == 'auto') {
    txtbin.onAutoMode();
  }
};

txtbin.onAutoMode = function() {
  txtbin.detectCurrentMode();
};

txtbin.activeMode = function(mode) {
  txtbin.setMode(mode, true);
};

txtbin.setDndHandlerMode = function(mode) {
  if (mode == 'b64') {
    txtbin.dndHandler.setMode('data');
  } else {
    txtbin.dndHandler.setMode('blob');
  }
};

txtbin.dump = function(s) {
  var mode = txtbin.getMode();
  var r;
  var buf;
  var b64;
  switch (mode) {
    case 'hex':
    case 'dec':
    case 'bin':
      buf = new Uint8Array(s);
      b64 = util.encodeBase64(buf, true);
      r = txtbin.getBinDump(mode, buf);
      break;
    case 'b64s':
      var key = $el('#key').value;
      buf = new Uint8Array(s);
      b64 = util.encodeBase64(buf, true);
      b64s = util.encodeBase64s(buf, key);
      r = txtbin.formatB64(b64s);
      $el('#key-update-button').disabled = false;
      break;
    case 'bsb64':
      var n = $el('#bsb64-n').value | 0;
      buf = new Uint8Array(s);
      b64 = util.encodeBase64(buf, true);
      var b64s = util.BSB64.encode(buf, n);
      r = txtbin.formatB64(b64s);
      break;
    case 'txt':
      buf = new Uint8Array(s);
      b64 = util.encodeBase64(buf, true);
      r = util.decodeBase64(b64);
      break;
    default:
      buf = txtbin.decodeBase64(s);
      r = txtbin.formatB64(s);
      b64 = txtbin.extractB64fromDataUrl(s);
  }
  var ftype = txtbin.analyzeBinary(buf, txtbin.file);
  txtbin.drawBinInfo(ftype, buf, b64);
  txtbin.setSrcValue(r, true);
  txtbin.bufCache = {
    ftype: ftype,
    buf: buf,
    b64: b64
  };
  txtbin.showPreview(txtbin.bufCache);
};

txtbin.decodeBase64 = function(s) {
  s = txtbin.extractB64fromDataUrl(s);
  return util.decodeBase64(s, true);
};

txtbin.extractB64fromDataUrl = function(s) {
  s = s.trim().replace(/\n/g, '');
  if (s.startsWith('data:')) {
    var a = s.split(',');
    s = a[1];
  }
  return s;
};

txtbin.drawBinInfo = function(ftype, buf, b64) {
  var bLen = buf.length;
  var b64Len = b64.length;
  var x = ((bLen == 0) ?  0 : util.round(b64Len / bLen, 2));
  var bSize = util.formatNumber(bLen);
  var b64Size = util.formatNumber(b64Len);

  var fileName = '-';
  var lastMod = '-';
  if (txtbin.file) {
    fileName = txtbin.file.name;
    lastMod = util.getDateTimeString(txtbin.file.lastModified);
  }

  var sizeInfo = bSize + ' bytes';
  if (bLen > 1024) {
    sizeInfo += ' (' + util.convByte(bLen) + 'B)';
  }
  sizeInfo += ' : ' + b64Size + ' bytes in Base64 (x ' + x + ')';

  var fileType = '';
  if (ftype['name']) {
    fileType += ftype['name'] + '  ';
  }
  fileType += '.' + ftype['ext'] + '  ' + ftype['mime']

  var s = '';
  s += 'FileName: ' + fileName + '\n';
  s += 'LastMod : ' + lastMod + '\n';
  s += 'Size    : ' + sizeInfo + '\n';
  s += 'SHA-1   : ' + txtbin.getSHA('SHA-1', buf, 1) + '\n';
  s += 'SHA-256 : ' + txtbin.getSHA('SHA-256', buf, 1) + '\n';
  s += 'Type    : ' + fileType + '\n';

  if (ftype['encoding']) {
    s += '\n' + txtbin.buildTextFileInfo(ftype);
  }

  var binDetail = ftype['bin_detail'];

  if (txtbin.isImage(ftype)) {
    if (binDetail) {
      s += txtbin.buildImageInfo(binDetail);
    }
  } else if (txtbin.isZip(ftype)) {
    s += 'Encryption: ';
    s += (binDetail['has_pw'] ? '<span class="caution">Y</span>' : 'N');
  } else if (binDetail && (typeof binDetail == 'string')) {
    s += '' + binDetail;
  }

  txtbin.drawInfo(s);
};

txtbin.buildImageInfo = function(binDetail) {
  var s = 'ImgSize : W ' + binDetail['w'] + ' x ' + 'H '  + binDetail['h'];
  return s;
};

txtbin.buildTextFileInfo = function(ftype) {
  var encInfo = ftype['encoding'];
  var type = encInfo.type;
  var newline = encInfo['newline'];
  var clzCrLf = 'status-inactive';
  var clzLf = 'status-inactive';
  var clzCr = 'status-inactive';
  var clzBom = 'status-inactive';
  var ttCrLf = '0';
  var ttLf = '0';
  var ttCr = '0';
  var isUnicode = txtbin.isUnicode(type);

  if (newline['crlf']) {
    clzCrLf = 'status-active';
    ttCrLf = newline['crlf'];
  }
  if (newline['lf']) {
    clzLf = 'status-active';
    ttLf = newline['lf'];
  }
  if (newline['cr']) {
    clzCr = 'status-active';
    ttCr = newline['cr'];
  }

  var encodingName = txtbin.getEncodingName(type);

  var s = 'Encoding: ' + encodingName;

  if (encInfo['bom']) {
    if (type == 'utf16') {
      s += ' ' + encInfo['bom'];
    }
    clzBom = 'status-active';
  }

  if (encInfo['bom'] || isUnicode) {
    s += ' <span class="' + clzBom + '">BOM</span>';
  }

  s += '  ';
  s += '<span class="cc-link ' + clzCrLf + '" data-tooltip="count=' + ttCrLf + '" onclick="txtbin.openUnicodeTable(\'0x000D\', true);">[CRLF]</span>';
  s += '<span class="cc-link ' + clzLf + '" data-tooltip="count=' + ttLf + '" onclick="txtbin.openUnicodeTable(\'0x000A\', true);">[LF]</span>';
  s += '<span class="cc-link ' + clzCr + '" data-tooltip="count=' + ttCr + '" onclick="txtbin.openUnicodeTable(\'0x000D\', true);">[CR]</span>\n';

  if (isUnicode) {
    s += txtbin.buildUnicodeInfo(encInfo, type);
  }

  return s;
};

txtbin.buildUnicodeInfo = function(encInfo, type) {
  var i, codeBlock, blockName;
  var clz = {};

  var codeblockCount = encInfo['codeblock_count'];
  for (i = 0; i < txtbin.CODE_BLOCKS.length; i++) {
    codeBlock = txtbin.CODE_BLOCKS[i];
    blockName = codeBlock['name'];

    var caution = codeBlock['caution'];
    clz[blockName] = 'status-inactive';
    if (codeblockCount[blockName] > 0) {
      clz[blockName] = 'status-active';
      if ((caution === true) || (caution && caution[type])) {
        clz[blockName] += ' char-caution';
      }
    }
  }

  var s = '';
  var blkCnt = 0;
  for (i = 0; i < txtbin.CODE_BLOCKS.length; i++) {
    codeBlock = txtbin.CODE_BLOCKS[i];
    var codeBlockLv = codeBlock['block_level'];

    s += txtbin.buildCodeBlockInfo(codeBlock, codeBlockLv, clz, codeblockCount, blkCnt);

    if (codeBlockLv == 0) {
      blkCnt = 0;
    } else {
      blkCnt++;
    }
  }
  return s;
};

txtbin.buildCodeBlockInfo = function(codeBlock, codeBlockLv, clz, codeblockCount, blkCnt) {
  var blockName = codeBlock['name'];

  var s = '';
  if (codeBlockLv == 0) {
    s += '\n';
  }

  var clazz = clz[blockName];
  var isSingleCd = txtbin.isSingleCode(codeBlock);
  if (isSingleCd) {
    clazz += ' code-single';
  } else {
    clazz += ' codeblock-lv-' + codeBlockLv;
  }

  s += '<span class="' + clazz + '">';
  if ((codeBlockLv != 0) && (blkCnt > 0)) {
    var mrgn = ((isSingleCd || codeBlockLv >= 2) ? 6 : 12);
    s += '<span style="margin-left:' + mrgn + 'px;">';
  }

  var cpS = codeBlock['ranges'][0]['cp_s'];
  var cpHexS = txtbin.toHex(cpS, true, '0x', 4);
  var cpRange = txtbin.buildCodeRangeString(codeBlock);
  var tooltip = cpRange + ': ' + codeBlock['fullname'];
  s += '<span class="code-range" data-tooltip="' + tooltip + ' (count=' + codeblockCount[blockName] + ')" ';
  s += 'onclick="txtbin.openUnicodeTable(\'' + cpHexS + '\', ' + isSingleCd + ');">';
  s += codeBlock['label'];
  s += '</span>';

  if (codeBlockLv == 0) {
    s += ': ';
  } else {
    s += '</span>';
  }

  s += '</span>';
  return s;
};

txtbin.openUnicodeTable = function(p, single) {
  var url = '../unicode.html?' + (single ? 'p' : 'start') + '=' + p;
  window.open(url, '_new');
};

txtbin.buildCodeRangeString = function(codeBlock) {
  var s = '';
  var codeBlockRangeList = codeBlock['ranges'];
  for (var i = 0; i < codeBlockRangeList.length; i++) {
    var range = codeBlockRangeList[i];
    var cp_s = range['cp_s'];
    var cp_e = range['cp_e'];
    if (i > 0) {
      s += ',';
    }
    s += 'U+' + txtbin.toHex(cp_s, true, '', 4);
    if (cp_e) {
      s += '-U+' + txtbin.toHex(cp_e, true, '', 4);
    }
  }
  return s;
};

txtbin.isSingleCode = function(codeBlock) {
  return (codeBlock['ranges'][0]['cp_e'] == undefined);
};

txtbin.isUnicode = function(type) {
  var pFix = type.substr(0, 3);
  return (pFix == 'utf');
};

txtbin.getEncodingName = function(id) {
  var nameLink = '';
  if (id in txtbin.CHARACTER_ENCODINGS) {
    var encoding = txtbin.CHARACTER_ENCODINGS[id];
    var name = encoding.name;
    var color = (encoding.color ? encoding.color : '#fff');
    var codetable = txtbin.getCodeTableUrl(id);
    nameLink = '<span style="color:' + color + ';'
    if (codetable) {
      nameLink += 'cursor:pointer;';
    }
    nameLink += '"';
    if (codetable) {
      nameLink += ' onclick="window.open(\'' + codetable + '\', \'_new\');"';
    }
    nameLink += '>' + name + '</span>';
  }
  return nameLink;
};

txtbin.getCodeTableUrl = function(encoding) {
  var path = null;
  if ((encoding == 'ascii') || (encoding.startsWith('utf'))) {
    path = 'unicode.html';
  }
  if (path) {
    path = '../' + path;
  }
  return path;
};

txtbin.getSHA = function(a, b, f) {
  var s = new window.jsSHA(a, (f ? 'UINT8ARRAY' : 'TEXT'));
  s.update(b);
  return s.getHash('HEX');
};

txtbin.decode = function() {
  txtbin.clearBuf();
  txtbin.bufCache = txtbin.updateInfoAndPreview();
  var mode = txtbin.getMode();
  if (mode == 'b64s') {
    $el('#key-update-button').disabled = false;
  }
};

txtbin.updateInfoAndPreview = function() {
  var mode = txtbin.getMode();
  var s = txtbin.getSrcValue();
  if ((mode == 'hex') && (txtbin.isPercentEncoding(s))) {
    s = s.replace(/%/g, '');
  }
  var b = txtbin.str2buf(mode, s);
  var b64 = util.encodeBase64(b, true);
  var ftype = txtbin.analyzeBinary(b, txtbin.file);
  txtbin.drawBinInfo(ftype, b, b64);
  var bufCache = {
    ftype: ftype,
    buf: b,
    b64: b64
  };
  txtbin.showPreview(bufCache);
  return bufCache;
};

txtbin.bin2uint8Array = function(s) {
  s = s.replace(/\s/g, '');
  return txtbin.str2binArr(s, 8, '0b');
};

txtbin.dec2uint8Array = function(s) {
  s = s.replace(/\n/g, ' ');
  s = s.replace(/\s{2,}/g, ' ');
  var w = s.split(' ');
  var a = [];
  for (var i = 0; i < w.length; i++) {
    a.push(w[i] | 0);
  }
  return a;
};

txtbin.hex2uint8Array = function(s) {
  s = s.replace(/\s/g, '');
  return txtbin.str2binArr(s, 2, '0x');
};

txtbin.b642uint8Array = function(s) {
  try {
    var a = txtbin.decodeBase64(s);
  } catch(e) {
    a = [];
  }
  return a;
};

txtbin.str2binArr = function(str, blkSize, pFix) {
  var a = [];
  for (var i = 0; i < str.length; i += blkSize) {
    var v = str.substr(i, blkSize);
    if (v.length == blkSize) {
      a.push(txtbin.parseInt(pFix + v));
    }
  }
  return a;
};

txtbin.parseInt = function(v) {
  var rdx = txtbin.checkRadix(v);
  if (rdx == 0) {
    return 0;
  } else if (rdx == 2) {
    v = v.substr(2);
  }
  return parseInt(v, rdx);
};

txtbin.checkRadix = function(v) {
  if (v.match(/^-{0,1}0x[0-9A-Fa-f\s]+$/i)) {
    return 16;
  } else if (v.match(/^-{0,1}0[0-7\s]+$/i)) {
    return 8;
  } else if (v.match(/^-{0,1}0b[01\s]+$/i)) {
    return 2;
  } else if (v.match(/^-{0,1}[0-9,]+$/)) {
    return 10;
  }
  return 0;
};

txtbin.getBinDump = function(mode, buf) {
  var showAddr = $el('#dump-flag-show-addr').checked;
  var showSp = $el('#dump-flag-show-sp').checked;
  var showAscii = $el('#dump-flag-show-ascii').checked;
  var uc = $el('#dump-flag-uc').checked;
  var lm = 0;
  var bLen = buf.length;
  if (lm == 0) lm = bLen;
  var len = ((bLen > lm) ? lm : bLen);
  if (len % 0x10 != 0) {
    len = (((len / 0x10) + 1) | 0) * 0x10;
  }

  var hd = '';
  if (showAddr) {
    hd += 'ADDRESS    ';
  }
  if (mode == 'bin') {
    if (showSp) {
      hd += '+0       +1       +2       +3       +4       +5       +6       +7        +8       +9       +A       +B       +C       +D       +E       +F      ';
    } else {
      hd += '+0      +1      +2      +3      +4      +5      +6      +7      +8      +9      +A      +B      +C      +D      +E      +F      ';
    }
  } else if (mode == 'dec') {
    if (showSp) {
      hd += ' +0  +1  +2  +3  +4  +5  +6  +7   +8  +9  +A  +B  +C  +D  +E  +F';
    } else {
      hd += ' +0 +1 +2 +3 +4 +5 +6 +7 +8 +9 +A +B +C +D +E +F';
    }
  } else {
    if (showSp) {
      hd += '+0 +1 +2 +3 +4 +5 +6 +7  +8 +9 +A +B +C +D +E +F';
    } else {
      hd += '+0+1+2+3+4+5+6+7+8+9+A+B+C+D+E+F';
    }
  }
  if (showAscii) {
    hd += '  ASCII           ';
  }
  hd += '\n';
  hd += util.repeatCh('-', hd.length - 1) + '\n';

  var dmp = '';
  if (showAddr || showAscii) {
    dmp += hd;
  }
  if (showAddr) {
    dmp += txtbin.dumpAddr(0, uc);
  }

  for (var i = 0; i < len; i++) {
    if (i < buf.length || showAscii) {
      dmp += txtbin.getDump(mode, i, buf, len, showSp, showAddr, showAscii, uc);
    }
  }

  var lastRows = 0;
  var lastLen = 0;

  if (bLen > lm) {
    if (bLen - lm > (0x10 * lastRows)) {
      dmp += '\n<span style="color:#ccc">...</span>';
    }
    if (lastRows > 0) {
      var rem = (bLen % 0x10);
      var st = (rem == 0 ? (bLen - lastLen) : ((bLen - rem) - (0x10 * (lastRows - 1))));
      if (st < len) {
        rem = ((len - st) % 0x10);
        st = len + rem;
      }
      var ed = bLen + (rem == 0 ? 0 : (0x10 - rem));
      dmp += '\n';
      if (showAddr) {
        dmp += txtbin.dumpAddr(st, uc);
      }
      for (i = st; i < ed; i++) {
        if (i < buf.length || showAscii) {
          dmp += txtbin.getDump(mode, i, buf, ed, showSp, showAddr, showAscii, uc);
        }
      }
    }
  }
  dmp += '\n';

  return dmp;
};

txtbin.getDump = function(mode, i, buf, len, showSp, showAddr, showAscii, uc) {
  var b;
  if (mode == 'bin') {
    b = txtbin.dumpBin(i, buf);
  } else if (mode == 'dec') {
    b = txtbin.dumpDec(i, buf);
  } else {
    b = txtbin.dumpHex(i, buf, uc);
  }
  if ((i + 1) % 0x10 == 0) {
    if (showAscii) {
      b += '  ' + txtbin.dumpAscii(((i + 1) - 0x10), buf);
    }
    if ((i + 1) < len) {
      b += '\n';
      if (showAddr) b += txtbin.dumpAddr(i + 1, uc);
    }
  } else if (showSp) {
    b += (((i + 1) % 8 == 0) ? '  ' : ' ');
  }
  return b;
},

txtbin.dumpAddr = function(i, uc) {
  var r = ('0000000' + i.toString(16)).slice(-8) + ' : ';
  return (uc ? r.toUpperCase() : r);
};
txtbin.dumpBin = function(i, buf) {
  return ((buf[i] == undefined) ? '        ' : txtbin.toBin(buf[i]));
};
txtbin.dumpDec = function(i, buf) {
  return ((buf[i] == undefined) ? '   ' : ('  ' + buf[i].toString()).slice(-3));
};
txtbin.dumpHex = function(i, buf, uc) {
  var r = ((buf[i] == undefined) ? '  ' : ('0' + buf[i].toString(16)).slice(-2));
  return (uc ? r.toUpperCase() : r);
};

txtbin.i2hex = function(i) {
  return ((i == undefined) ? '' : ('0' + i.toString(16)).slice(-2).toUpperCase());
};

txtbin.dumpAscii = function(pos, buf) {
  var dumpMB = $el('#dump-multibyte').checked;
  var b = '';
  var end = pos + 0x10;
  var c0, c1, c2, c3;
  for (var i = pos; i < end; i++) {
    var code = buf[i];
    if (code == undefined) break;

    if (dumpMB) {
      var uri = null;
      var pd = '';
      var skip = 0;
      if ((code & 0xF0) == 0xF0) {
        c0 = txtbin.i2hex(buf[i]);
        c1 = txtbin.i2hex(buf[i + 1]);
        c2 = txtbin.i2hex(buf[i + 2]);
        c3 = txtbin.i2hex(buf[i + 3]);
        if ((c1 != '') && (c2 != '') && (c3 != '')) {
          uri = '%' + c0 + '%' + c1 + '%' + c2 + '%' + c3;
        }
        skip = 3;
        pd = '  ';
      } else if ((code & 0xE0) == 0xE0) {
        c0 = txtbin.i2hex(buf[i]);
        c1 = txtbin.i2hex(buf[i + 1]);
        c2 = txtbin.i2hex(buf[i + 2]);
        if ((c1 != '') && (c2 != '')) {
          uri = '%' + c0 + '%' + c1 + '%' + c2;
        }
        skip = 2;
        pd = ' ';
      } else if ((code & 0xC0) == 0xC0) {
        c0 = txtbin.i2hex(buf[i]);
        c1 = txtbin.i2hex(buf[i + 1]);
        if ((c1 != '') && (c2 != '')) {
          uri = '%' + c0 + '%' + c1;
        }
        skip = 1;
      }

      try {
        if (uri) {
          var c = decodeURI(uri);
          b += c + pd;
          i += skip;
          continue;
        }
      } catch(e) {}
    }

    switch (code) {
      case 0x0A:
        b += txtbin.TXT_CHR_LF;
        break;
      case 0x0D:
        b += txtbin.TXT_CHR_CR;
        break;
      default:
        if ((code >= 0x20) && (code <= 0x7E)) {
          b += String.fromCharCode(code);
        } else {
          b += '.';
        }
    }
  }
  return b;
};

txtbin.getEncoding = function(buf) {
  var typeScore = {
    ascii: 1,
    utf8: 0,
    utf16: 0,
    sjis: 0,
    iso2022jp: 0,
    euc_jp: 0,
    bin: 0
  };

  var flags = {
    general: {
      newline: {
        lf: 0,
        cr: 0,
        crlf: 0
      }
    },
    utf8: {
      bom: '',
      codeblock_count: {}
    },
    utf16be: {
      newline: {
        lf: 0,
        cr: 0,
        crlf: 0
      },
      bom: '',
      codeblock_count: {}
    },
    utf16le: {
      newline: {
        lf: 0,
        cr: 0,
        crlf: 0
      },
      bom: '',
      codeblock_count: {}
    },
    wk: {
      tmpNL: null
    }
  };

  for (i = 0; i < txtbin.CODE_BLOCKS.length; i++) {
    codeBlock = txtbin.CODE_BLOCKS[i];
    var blockName = codeBlock['name'];
    flags['utf8']['codeblock_count'][blockName] = 0;
    flags['utf16be']['codeblock_count'][blockName] = 0;
    flags['utf16le']['codeblock_count'][blockName] = 0;
  }

  var f = false;
  if (txtbin.isUtf8Bom(buf)) {
    typeScore = txtbin.setScore(typeScore, 'utf8');
    f = true;
    flags['utf8']['bom'] = 'UTF-8';
    typeScore['utf16'] = -1;
  } else if (txtbin.isUtf16LeBom(buf)) {
    typeScore = txtbin.setScore(typeScore, 'utf16le');
    f = true;
    flags['utf16le']['bom'] = 'LE';
    typeScore['utf8'] = -1;
  } else if (txtbin.isUtf16BeBom(buf)) {
    typeScore = txtbin.setScore(typeScore, 'utf16be');
    f = true;
    flags['utf16be']['bom'] = 'BE';
    typeScore['utf8'] = -1;
  }

  if (f) {
    typeScore['sjis'] = -1;
    typeScore['iso2022jp'] = -1;
    typeScore['euc_jp'] = -1;
  }

  var evn = ((buf.length % 2) == 0);
  for (var i = 0; i < buf.length; i++) {
    var code = buf[i];
    var leftLen = buf.length - i;

    var ptn4 = txtbin.fetchBufAsIntByBE(buf, i, 4);
    var ptn3 = txtbin.fetchBufAsIntByBE(buf, i, 3);
    var ptn2 = txtbin.fetchBufAsIntByBE(buf, i, 2);

    var ptn2U = ptn2;
    var ptn2L = (ptn4 & 0xFFFF);
    var ptn2Ur = txtbin.switchEndian(ptn2U);
    var ptn2Lr = txtbin.switchEndian(ptn2L);

    var chunk = {
      leftLen: leftLen,
      ptn4: ptn4,
      ptn2: ptn2,
      ptn2U: ptn2U,
      ptn2L: ptn2L,
      ptn2Ur: ptn2Ur,
      ptn2Lr: ptn2Lr,
      ptn3: ptn3
    };

    txtbin.checkNewline(buf, i, code, chunk, flags);
    txtbin.checkNonBmp(buf, i, code, chunk, flags);

    for (var j = 0; j < txtbin.CODE_BLOCKS.length; j++) {
      var codeBlock = txtbin.CODE_BLOCKS[j];
      txtbin.checkCodeBlock(buf, i, code, chunk, flags, codeBlock);
    }

    var uri = null;
    var skip = 0;
    var c0, c1, c2, c3;
    if ((code & 0xF0) == 0xF0) {
      c0 = txtbin.i2hex(buf[i]);
      c1 = txtbin.i2hex(buf[i + 1]);
      c2 = txtbin.i2hex(buf[i + 2]);
      c3 = txtbin.i2hex(buf[i + 3]);
      if ((c1 != '') && (c2 != '') && (c3 != '')) {
        uri = '%' + c0 + '%' + c1 + '%' + c2 + '%' + c3;
      }
      skip = 3;
      flags['utf8']['codeblock_count']['non_bmp']++;
    } else if ((code & 0xE0) == 0xE0) {
      c0 = txtbin.i2hex(buf[i]);
      c1 = txtbin.i2hex(buf[i + 1]);
      c2 = txtbin.i2hex(buf[i + 2]);
      if ((c1 != '') && (c2 != '')) {
        uri = '%' + c0 + '%' + c1 + '%' + c2;
      }
      skip = 2;
      flags['utf8']['codeblock_count']['bmp']++;
    } else if ((code & 0xC0) == 0xC0) {
      c0 = txtbin.i2hex(buf[i]);
      c1 = txtbin.i2hex(buf[i + 1]);
      if ((c1 != '') && (c2 != '')) {
        uri = '%' + c0 + '%' + c1;
      }
      skip = 1;
      flags['utf8']['codeblock_count']['bmp']++;
    } else if (code >= 0x80) {
      typeScore['ascii'] = -1;
      typeScore['utf8'] = -1;
      if (evn) {
        typeScore = txtbin.incrementScore(typeScore, 'utf16');
      } else {
        if (typeScore['bin'] != -1) {
          typeScore['bin'] = 1;
        }
      }
    } else if (code == 0x00) {
      typeScore['ascii'] = -1;
      typeScore['utf8'] = -1;
      typeScore['sjis'] = -1;
      typeScore['iso2022jp'] = -1;
      typeScore['euc_jp'] = -1;

      if (evn) {
        typeScore = txtbin.incrementScore(typeScore, 'utf16');
      } else {
        if (typeScore['bin'] != -1) {
          typeScore['bin'] = 1;
        }
      }
    }

    if (uri && (typeScore['utf8'] >= 0)) {
      try {
        var c = decodeURI(uri);
        i += skip;
        typeScore = txtbin.incrementScore(typeScore, 'utf8');
        var cp = c.charCodeAt(0);
        if (txtbin.inRange(cp, 0x80, 0xFF)) {
          flags['utf8']['codeblock_count']['latin1_suppl']++;
        }
      } catch(e) {}
    }

    if (typeScore['sjis'] >= 0) {
      if (txtbin.isSjis(buf, i, true)) {
        typeScore = txtbin.incrementScore(typeScore, 'sjis');
        typeScore['utf16'] = -1;
      }
    }

    if (typeScore['iso2022jp'] >= 0) {
      if (txtbin.isIso2022jp(buf, i)) {
        typeScore = txtbin.incrementScore(typeScore, 'iso2022jp');
        typeScore['utf16'] = -1;
      }
    }

    if (typeScore['euc_jp'] >= 0) {
      if (txtbin.isEuc(buf, i, true)) {
        typeScore = txtbin.incrementScore(typeScore, 'euc_jp');
        typeScore['utf16'] = -1;
      }
    }
  }

  typeScore = util.sortObjectKeyByValue(typeScore, true);
  for (var type in typeScore) {
    break;
  }

  if (type == 'utf16') {
    if (txtbin.isUtf16Le(buf)) {
      type = 'utf16le';
    } else if (txtbin.isUtf16Be(buf)) {
      type = 'utf16be';
    } else {
      type = 'bin';
    }
  }

  var encoding = {
    type: type,
    newline: flags['general']['newline'],
    codeblock_count: {}
  };

  if (txtbin.isUnicode(type)) {
    var srcFlags = flags[type];
    for (var key in srcFlags) {
      encoding[key] = srcFlags[key];
    }
    if (encoding['bom']) {
      if (type.startsWith('utf16')) {
        encoding['type'] = 'utf16';
      }
    }
  }

  return encoding;
};

txtbin.checkCodeBlock = function(buf, pos, code, chunk, flags, codeBlock) {
  if (codeBlock['skip_check']) {
    return;
  }

  var blockName = codeBlock['name'];
  var codeBlockRangeList = codeBlock['ranges'];
  for (var i = 0; i < codeBlockRangeList.length; i++) {
    var range = codeBlockRangeList[i];
    if (range['cp_s'] >= 0x10000) {
      txtbin.checkCodeBlock2(buf, pos, code, chunk, flags, blockName, range);
    } else {
      txtbin.checkCodeBlock1(buf, pos, code, chunk, flags, blockName, range);
    }
  }
};

txtbin.checkNewline = function(buf, pos, code, chunk, flags) {
  if (pos % 2 == 0) {
    if (chunk['ptn4'] == 0x000D000A) {
      flags['utf16be']['newline']['crlf']++;
    } else if (chunk['ptn4'] == 0x0D000A00) {
      flags['utf16le']['newline']['crlf']++;
    } else if ((chunk['ptn2L'] == 0x000A) && (chunk['ptn2U'] != 0x000D)) {
      flags['utf16be']['newline']['lf']++;
    } else if ((chunk['ptn2L'] == 0x0A00) && (chunk['ptn2U'] != 0x0D00)) {
      flags['utf16le']['newline']['lf']++;
    } else if ((chunk['ptn2U'] == 0x000D) && (chunk['ptn2L'] != 0x000A)) {
      flags['utf16be']['newline']['cr']++;
    } else if ((chunk['ptn2U'] == 0x0D00) && (chunk['ptn2L'] != 0x0AA0)) {
      flags['utf16le']['newline']['cr']++;
    }
  }

  if (chunk['ptn2U'] == 0x0D0A) {
    flags['general']['newline']['crlf']++;
  }

  if (code == 0x0D) {
    flags['wk']['tmpNL'] = 'CR';
    if (pos == buf.length - 1) {
      flags['general']['newline']['cr']++;
    }
  } else if (code == 0x0A) {
    if (flags['wk']['tmpNL'] != 'CR') {
      flags['general']['newline']['lf']++;
    }
    flags['wk']['tmpNL'] = null;
  } else {
    if (flags['wk']['tmpNL'] == 'CR') {
      flags['general']['newline']['cr']++;
    }
    flags['wk']['tmpNL'] = null;
  }

  return flags;
};

txtbin.checkAscii = function(buf, pos, code, chunk, flags) {
  if (pos % 2 == 0) {
    if (txtbin.inRange(chunk['ptn2U'], 0x0020, 0x007F)) {
      flags['utf16be']['codeblock_count']['ascii']++;
    } else if (txtbin.inRange(chunk['ptn2Ur'], 0x0020, 0x007F)) {
      flags['utf16le']['codeblock_count']['ascii']++;
    }
  }

  if (txtbin.inRange(code, 0x20, 0x7F)) {
    flags['utf8']['codeblock_count']['ascii']++;
  }

  return flags;
};

txtbin.checkCodeBlock1 = function(buf, pos, code, chunk, flags, blockName, range) {
  var utf16S = range['utf16_s'];
  var utf16E = range['utf16_e'];
  var utf8S = range['utf8_s'];
  var utf8E = range['utf8_e'];

  if (utf16E == undefined) {
    utf16E = utf16S;
  }

  if (utf8E == undefined) {
    utf8E = utf8S;
  }

  if (pos % 2 == 0) {
    if ((chunk['ptn2U'] >= utf16S) && (chunk['ptn2U'] <= utf16E)) {
      flags['utf16be']['codeblock_count'][blockName]++;
    } else if ((chunk['ptn2Ur'] >= utf16S) && (chunk['ptn2Ur'] <= utf16E)) {
      flags['utf16le']['codeblock_count'][blockName]++;
    }
  }

  var utf8B = chunk['ptn3'];
  if (txtbin.inRange(utf8S, 0xC280, 0xDFBF)) {
    utf8B = chunk['ptn2'];
  } else if (txtbin.inRange(utf8S, 0x00, 0x7F)) {
    utf8B = code;
  }

  if ((utf8B >= utf8S) && (utf8B <= utf8E)) {
    flags['utf8']['codeblock_count'][blockName]++;
  }

  return flags;
};

txtbin.checkCodeBlock2 = function(buf, pos, code, chunk, flags, blockName, range) {
  if (chunk['leftLen'] < 4) {
    return flags;
  }

  var utf16S = range['utf16_s'];
  var utf16E = range['utf16_e'];
  var utf8S = range['utf8_s'];
  var utf8E = range['utf8_e'];

  if (utf16S == undefined) {
    return flags;
  }

  if (utf16E == undefined) {
    utf16E = utf16S;
  }

  if (utf8E == undefined) {
    utf8E = utf8S;
  }

  if (pos % 2 == 0) {
    var u4r = (chunk['ptn2Ur'] * (2 ** 16));
    var ptn4r = u4r + chunk['ptn2Lr'];
    if ((chunk['ptn4'] >= utf16S) && (chunk['ptn4'] <= utf16E)) {
      flags['utf16be']['codeblock_count'][blockName]++;
    } else if ((ptn4r >= utf16S) && (ptn4r <= utf16E)) {
      flags['utf16le']['codeblock_count'][blockName]++;
    }
  }

  if (utf8S == undefined) {
    return flags;
  }

  if ((chunk['ptn4'] >= utf8S) && (chunk['ptn4'] <= utf8E)) {
    flags['utf8']['codeblock_count'][blockName]++;
  }
  return flags;
};

txtbin.checkNonBmp = function(buf, pos, code, chunk, flags) {
  if (pos % 2 == 0) {
    if (txtbin.isUpperSurrogate(chunk['ptn2U']) && txtbin.isLowerSurrogate(chunk['ptn2L'])) {
      flags['utf16be']['codeblock_count']['non_bmp']++;
    } else if (txtbin.isUpperSurrogate(chunk['ptn2Ur']) && txtbin.isLowerSurrogate(chunk['ptn2Lr'])) {
      flags['utf16le']['codeblock_count']['non_bmp'] = true;
    } else {
      if (!(txtbin.isUtf16BomSeq(chunk['ptn2U']) || txtbin.isUtf16BomSeq(chunk['ptn2Ur']) || txtbin.isSurrogate(chunk['ptn2U']) || txtbin.isSurrogate(chunk['ptn2Ur']))) {
        flags['utf16le']['codeblock_count']['bmp']++;
        flags['utf16be']['codeblock_count']['bmp']++;
      }
    }
  }
  return flags;
};

txtbin.inRange = function(c, s, e) {
  return ((c >= s) && (c <= e));
};

txtbin.isSurrogate = function(v) {
  return (txtbin.isUpperSurrogate(v) || txtbin.isLowerSurrogate(v));
};

txtbin.isUpperSurrogate = function(v) {
  return txtbin.inRange(v, 0xD800, 0xDBFF);
};

txtbin.isLowerSurrogate = function(v) {
  return txtbin.inRange(v, 0xDC00, 0xDFFF);
};

txtbin.isUtf16BomSeq = function(v) {
  return ((v == 0xFFFE) || (v == 0xFEFF));
};

txtbin.switchEndian = function(u16) {
  var vU = (u16 >> 8) & 0xFF;
  var vL = u16 & 0xFF;
  var r = ((vL << 8) + vU) & 0xFFFF;
  return r;
};

txtbin.setScore = function(o, k) {
  o = txtbin.disableAllScore(o);
  o[k] = 1;
  return o;
};

txtbin.incrementScore = function(o, k) {
  if (o[k] >= 0) o[k]++;
  o['ascii'] = -1;
  return o;
};

txtbin.disableAllScore = function(o) {
  for (var k in o) {
    o[k] = -1;
  }
  return o;
};

txtbin.analyzeBinary = function(b, f){
  var tp = txtbin.getFileType(b, f);
  return tp;
};

txtbin.getFileType = function(b, f) {
  var filetypes = txtbin.FILETYPES;
  var ftype = {
    mime: 'text/plain',
    ext: 'txt',
    encoding: null,
    info: null
  };

  for (var k in filetypes) {
    var tp = filetypes[k]
    if (!tp['head']) continue;
    if (txtbin._hasBinaryPattern(b, 0, tp['head'])) {
      ftype = tp;
      break;
    }
  }

  if (f) {
    var fileName = f.name;
    var ext = txtbin.getExtension(fileName);
    var mime = txtbin.getMimeType(ext);
    ftype['ext'] = ext;
    if (mime) ftype['mime'] = mime;
  }

  var dc = ftype['mime'].split('/')[0];
  if (dc == 'text') {
    var enc = txtbin.getEncoding(b);
    if (enc['type'] == 'bin') {
      ftype['mime'] = 'application/octet-stream';
      ftype['ext'] = '???';
    } else {
      ftype['encoding'] = enc;
    }
  } else {
    var binDetail = txtbin.getBinDetail(b, ftype['mime'], ftype['ext']);
    ftype['bin_detail'] = binDetail;
  }

  if (txtbin.isZip(ftype)) {
    var w = txtbin.getZipContentType(b);
    if (w) ftype = w;
  }

  return ftype;
};

txtbin.getExtension = function(fileName) {
  var ext = '';
  if (fileName.match(/^.*\.[^.]+?$/)) {
    ext = fileName.replace(/^.*\.([^.]+?)$/, '$1');
  }
  return ext;
};

txtbin.getMimeType = function(ext) {
  var types = txtbin.FILETYPES;
  for (var k in types) {
    var tp = types[k];
    if (tp['ext'] == ext) {
      return tp['mime'];
    }
  }
  return null;
};

txtbin.hasBinaryPattern = function(buf, bytesPattern) {
  var ptn = bytesPattern.split(' ');
  if (buf.length < ptn.length) return false;
  for (var i = 0; i < buf.length; i++) {
    if (txtbin._hasBinaryPattern(buf, i, bytesPattern)) return true;
  }
  return false;
};

txtbin._hasBinaryPattern = function(buf, pos, bytesPattern) {
  if (bytesPattern instanceof Array) {
    for (var i = 0; i < bytesPattern.length; i++) {
      if (txtbin.bytecmp(buf, pos, bytesPattern[i])) return true;
    }
  } else {
    return txtbin.bytecmp(buf, pos, bytesPattern);
  }
  return false;
};

txtbin.bytecmp = function(buf, pos, bytesPattern) {
  var ptn = bytesPattern.split(' ');
  if (buf.length < ptn.length) {
    return false;
  }
  var v;
  for (var i = 0; i < ptn.length; i++) {
    var hex = ptn[i];
    if (hex == 'xx') {
      continue;
    }
    if (hex.match(/\|/)) {
      var w = hex.split('|');
      for (var j = 0; j < w.length; j++) {
        v = +('0x' + w[j]);
        if (v == buf[i + pos]) {
          break;
        }
      }
      if (j == w.length) {
        return false;
      }
    } else {
      v = +('0x' + hex);
      if (v != buf[i + pos]) {
        return false;
      }
    }
  }
  return true;
};

txtbin.getMimeClass = function(ftype) {
  return ftype['mime'].split('/')[0];
};

txtbin.isMedia = function(ftype) {
  if (!ftype) return false;
  var mimeClass = txtbin.getMimeClass(ftype);
  switch (mimeClass) {
    case 'image':
    case 'audio':
    case 'video':
      return true;
  }
  return false;
};

txtbin.isImage = function(ftype) {
  return (txtbin.getMimeClass(ftype) == 'image');
};

txtbin.isZip = function(ftype) {
  return (ftype['mime'] == 'application/x-zip-compressed');
};

txtbin.isAscii = function(b) {
  return ((b >= 0) && (b <= 0x7F));
};

txtbin.isUtf8Bom = function(buf) {
  return txtbin._hasBinaryPattern(buf, 0, 'EF BB BF');
};

txtbin.isUtf16BeBom = function(buf) {
  return txtbin._hasBinaryPattern(buf, 0, 'FE FF');
};

txtbin.isUtf16LeBom = function(buf) {
  return txtbin._hasBinaryPattern(buf, 0, 'FF FE');
};

txtbin.isUtf16Le = function(buf) {
  if (buf.length % 2 != 0) return false;
  if (buf.length < 2) return false;
  var f = false;
  for (var i = 0; i < buf.length - 1; i++) {
    if ((i % 2) == 0) {
      if (buf[i] == 0x00) {
        return false;
      } if ((buf[i] != 0x00) && (buf[i + 1] == 0x00)) {
        f = true;
      }
    }
  }
  return f;
};

txtbin.isUtf16Be = function(buf) {
  if (buf.length % 2 != 0) return false;
  if (buf.length < 2) return false;
  var f = false;
  for (var i = 0; i < buf.length - 1; i++) {
    if ((i % 2) == 0) {
      if ((buf[i] == 0x00) && (buf[i + 1] != 0x00)) {
        f = true;
      }
    } else {
      if (buf[i] == 0x00) {
        return false;
      }
    }
  }
  return f;
};

txtbin.isIso2022jp = function(buf, pos) {
  var ESCSEQ_ASCII = '1B 28 42';
  var ESCSEQ_LATIN = '1B 28 4A';
  var ESCSEQ_JA = '1B 24 42';
  if (txtbin._hasBinaryPattern(buf, pos, ESCSEQ_ASCII)) return true;
  if (txtbin._hasBinaryPattern(buf, pos, ESCSEQ_LATIN)) return true;
  if (txtbin._hasBinaryPattern(buf, pos, ESCSEQ_JA)) return true;
  return false;
};

txtbin.isSjis = function(buf, pos, exclAscii) {
  var b1 = buf[pos];
  var b2 = buf[pos + 1];
  if ((b1 == undefined) || (b2 == undefined)) return false;
  if (exclAscii) {
    if (txtbin.isAscii(b1) && txtbin.isAscii(b2)) return false;
  }
  return (txtbin.isSjisMultiByte1(b1) && txtbin.isSjisMultiByte2(b2));
};
txtbin.isSjisMultiByte1 = function(b) {
  return (((b >= 0x81) && (b <= 0x9F)) || ((b >= 0xE0) && (b <= 0xFC)));
};
txtbin.isSjisMultiByte2 = function(b) {
  return (((b >= 0x40) && (b <= 0xFC)) && (b != 0x7F));
};

txtbin.isEuc = function(buf, pos, exclAscii) {
  var b1 = buf[pos];
  var b2 = buf[pos + 1];
  if ((b1 == undefined) || (b2 == undefined)) return false;
  if (exclAscii) {
    if (txtbin.isAscii(b1) && txtbin.isAscii(b2)) return false;
  }
  return (txtbin.isEucMultiByte1(b1) && txtbin.isEucMultiByte2(b2));
};
txtbin.isEucMultiByte1 = function(b) {
  if ((b == 0x8E) || (b == 0x8F) || ((b >= 0xA1) && (b <= 0xFE))) {
    return true;
  }
  return false;
};
txtbin.isEucMultiByte2 = function(b) {
  if ((b >= 0xA1) && (b <= 0xFE)) {
    return true;
  }
  return false;
};

txtbin.getZipContentType = function(buf) {
  for (var k in txtbin.FILETYPES) {
    var ftype = txtbin.FILETYPES[k];
    var hexptn = ftype['hexptn'];
    if (ftype['supertype'] == 'zip') {
      if (txtbin.hasBinaryPattern(buf, hexptn)) return ftype;
    }
  }
  return null;
};

txtbin.toBin = function(v) {
  return ('0000000' + v.toString(2)).slice(-8);
};

txtbin.formatB64 = function(s) {
  var isDataUrl = (s.match(/,/) ? true : false);
  if (isDataUrl) {
    var a = s.split(',');
    s = a[1];
  }
  var n = $el('#newline').value | 0;
  if (n < 0) n = 0;
  var b64 = txtbin.inertNewline(s, n);
  var r = (isDataUrl ? (a[0] + ',\n') : '') + b64;
  return r;
};

txtbin.inertNewline = function(s, n) {
  if (n == undefined) n = 76;
  var r = util.insertCh(s, '\n', n);
  return r;
};

txtbin.getBinDetail = function(b, mime, ext) {
  var r = {};
  if (ext == 'avif') {
    r = txtbin.getAvifInfo(b);
  } else if (ext == 'bmp') {
    r = txtbin.getBmpInfo(b);
  } else if (ext == 'class') {
    r = txtbin.getJavaClassVersion(b);
  } else if (ext == 'cur') {
    r = txtbin.getIcoInfo(b);
  } else if (mime == 'application/x-msdownload') {
    var a = txtbin.getExeArch(b);
    r = 'Arch    : ' + a;
  } else if (ext == 'ico') {
    r = txtbin.getIcoInfo(b);
  } else if (ext == 'jpg') {
    r = txtbin.getJpegInfo(b);
  } else if (ext == 'png') {
    r = txtbin.getPngInfo(b);
  } else if (ext == 'zip') {
    r = txtbin.getZipInfo(b);
  }
  return r;
};

txtbin.getExeArch = function(b) {
  var pe = -1;
  var len = 512;
  for (var i = 0; i < len; i++) {
    if (i + 3 >= len) break;
    var ptn = txtbin.fetchBufAsIntByBE(b, i, 4);
    if (ptn == 0x50450000) {
      pe = i;break;
    }
  }
  var v = 0;
  if ((pe >= 0) && (pe + 5 < len)) {
    v = txtbin.fetchBufAsIntByBE(b, pe + 4, 2);
  }
  var arch = '';
  if (v == 0x6486) {
    arch = 'x86-64 (64bit)';
  } else if (v == 0x4C01) {
    arch = 'x86 (32bit)';
  }
  return arch;
};

txtbin.getAvifInfo = function(b) {
  var r = {w: 0, h: 0};
  if (b.length < 208) {
    return r;
  }
  var posW = 0xC4;
  var posH = 0xC8;
  var w = txtbin.fetchBufAsIntByBE(b, posW, 4);
  var h = txtbin.fetchBufAsIntByBE(b, posH, 4);
  r['w'] = w;
  r['h'] = h;
  return r;
};

txtbin.getBmpInfo = function(b) {
  var r = {w: 0, h: 0};
  if (b.length < 26) {
    return r;
  }
  var posW = 0x12;
  var posH = 0x16;
  var w = txtbin.fetchBufAsIntByLE(b, posW, 4);
  var h = txtbin.fetchBufAsIntByLE(b, posH, 4);
  r['w'] = w;
  r['h'] = h;
  return r;
};

txtbin.getIcoInfo = function(b) {
  var r = {w: 0, h: 0};
  if (b.length < 6) {
    return r;
  }
  var posW = 0x6;
  var posH = 0x7;
  var w = txtbin.fetchBufAsIntByLE(b, posW, 1);
  var h = txtbin.fetchBufAsIntByLE(b, posH, 1);
  r['w'] = (w ? w : 256);
  r['h'] = (h ? h : 256);
  return r;
};

txtbin.getJpegInfo = function(b) {
  var r = {w: 0, h: 0};
  var SOF = 'FF C0|C2';
  var p = txtbin.scanBuf(b, SOF);
  if (p == -1) {
    return r;
  }
  var offsetH = 5;
  var offsetW = 7;
  var posH = p + offsetH;
  var posW = p + offsetW;
  var h = txtbin.fetchBufAsIntByBE(b, posH, 2);
  var w = txtbin.fetchBufAsIntByBE(b, posW, 2);
  r['w'] = w;
  r['h'] = h;
  return r;
};

txtbin.getPngInfo = function(b) {
  var r = {w: 0, h: 0};
  if (b.length < 26) {
    return r;
  }
  var posIHDR = 0x08;
  var posW = posIHDR + 0x08;
  var posH = posIHDR + 0x0C;
  var w = txtbin.fetchBufAsIntByBE(b, posW, 4);
  var h = txtbin.fetchBufAsIntByBE(b, posH, 4);
  r['w'] = w;
  r['h'] = h;
  return r;
};

txtbin.getZipInfo = function(b) {
  var hasPw = b[6] & 1;
  var r = {
    has_pw: hasPw
  };
  return r;
};

txtbin.getJavaClassVersion = function(b) {
  var v = b[7];
  var j;
  if (v <= 48) {
    j = '1.' + v - 44;
  } else {
    j = v - 44;
  }
  var s = 'Java    : Java SE ' + j + ' : version = ' + v + ' (' + txtbin.toHex(v, true, '0x', 2) + ')';
  return s;
};

txtbin.fetchBufAsIntByLE = function(b, pos, size) {
  if (pos == undefined) {
    pos = 0;
  }
  if ((pos + size) > b.length) {
    return -1;
  }
  var r = 0;
  for (var i = 0; i < size; i++) {
    r += b[pos + i] * (2 ** (8 * i));
  }
  return r;
};

txtbin.fetchBufAsIntByBE = function(b, pos, size) {
  if (pos == undefined) {
    pos = 0;
  }
  if ((pos + size) > b.length) {
    return -1;
  }
  var r = 0;
  for (var i = 0; i < size; i++) {
    r += b[pos + i] * (2 ** (8 * (size - i - 1)));
  }
  return r;
};

txtbin.scanBuf = function(buf, bytesPattern, pos) {
  if (pos == undefined) {
    pos = 0;
  }
  var targetLen = buf.length - pos;
  if (targetLen < bytesPattern.length) {
    return -1;
  }
  for (var i = pos; i < buf.length; i++) {
    if (txtbin.bytecmp(buf, i, bytesPattern)) {
      return i;
    }
  }
  return -1;
};

txtbin.toHex = function(v, uc, pFix, d) {
  var hex = parseInt(v).toString(16);
  return txtbin.formatHex(hex, uc, pFix, d);
};

txtbin.formatHex = function(hex, uc, pFix, d) {
  if (uc) hex = hex.toUpperCase();
  if ((d) && (hex.length < d)) {
    hex = (util.repeatCh('0', d) + hex).slice(d * (-1));
  }
  if (pFix) hex = pFix + hex;
  return hex;
};

txtbin.extractBinTextPart = function(mode, s) {
  var unit = 2;
  if (mode == 'bin') {
    unit = 8;
  } else if (mode == 'dec') {
    unit = 3;
  }
  var vStart = 11;
  var eEnd = unit * 16 + 16;
  s = s.trim();
  if (!s.toUpperCase().startsWith('ADDRESS')) return s;
  var a = util.text2list(s);
  var b = '';
  for (var i = 2; i < a.length; i++) {
    var l = a[i];
    var w = l.substr(vStart, eEnd);
    b += w + '\n';
  }
  return b;
};

txtbin.onInput = function() {
  txtbin.clearBuf();
  if (txtbin.auto) {
    txtbin.detectCurrentMode();
  }
  if ($el('#show-preview').checked && $el('#show-preview-rt').checked) {
    txtbin.updateInfoAndPreview();
  }
};

txtbin.onRealtimePreviewChange = function() {
  if ($el('#show-preview').checked && $el('#show-preview-rt').checked) {
    txtbin.updateInfoAndPreview();
  }
};

txtbin.onChangeDumpFlag = function() {
  if (!txtbin.bufCache) {
    return;
  }
  var mode = txtbin.getMode();
  switch (mode) {
    case 'hex':
    case 'dec':
    case 'bin':
      txtbin.switchRadix(mode, txtbin.bufCache);
  }
};

txtbin.onChangeShowPreview = function() {
  if (!txtbin.bufCache) {
    return;
  }
  txtbin.showPreview(txtbin.bufCache);
};

txtbin.onChangeShowPreviewCc = function() {
  if (!txtbin.bufCache) {
    return;
  }
  var ftype = txtbin.bufCache.ftype;
  var previewMode = $el('#preview-mode').value;
  if ((previewMode == 'txt') || !txtbin.isMedia(ftype)) {
    txtbin.onChangeShowPreview();
  }
};

txtbin.onChangeWordWrap = function() {
  var ftype = (txtbin.bufCache ? txtbin.bufCache.ftype : null);
  var previewMode = $el('#preview-mode').value;
  if ((previewMode == 'txt') || !txtbin.isMedia(ftype)) {
    if ($el('#word-wrap').checked) {
      $el('#preview').removeClass('line-break-asis');
      $el('#preview').addClass('line-break-viewport-width');
    } else {
      $el('#preview').removeClass('line-break-viewport-width');
      $el('#preview').addClass('line-break-asis');
    }
  }
};

txtbin.onDnd = function(s, f) {
  txtbin.file = f;
  var showInfoRequired = true;
  if ((s instanceof ArrayBuffer) || (f && txtbin.isB64Mode())) {
    txtbin.dump(s);
    showInfoRequired = false;
  } else {
    txtbin.setSrcValue(s, true);
    if (txtbin.auto) {
      txtbin.detectCurrentMode();
    }
  }
  var mode = txtbin.getMode();
  txtbin.setMode(mode);
  if (showInfoRequired) {
    txtbin.updateInfoAndPreview();
  }
};

txtbin.onDndLoadStart = function(f) {
  txtbin.clearBuf();
  txtbin.setSrcValue('Loading...', true);
  txtbin.drawInfo('<span style="color:#888;">CONTENT INFO</span>');
  txtbin.drawPreview('<span style="color:#888;">PREVIEW</span>');
};

txtbin.onDndLoadProgress = function(e, loaded, total, pct) {
  var s = 'Loading... ' + pct + '%';
  txtbin.setSrcValue(s, false);
};

txtbin.getSrcValue = function() {
  return $el('#src').value;
};

txtbin.setSrcValue = function(s, resetPos) {
  $el('#src').value = s;
  if (resetPos) {
    $el('#src').scrollToTop();
    $el('#src').scrollToLeft();
  }
};

txtbin.detectCurrentMode = function() {
  var m = 'txt';
  var v = txtbin.getSrcValue();
  if (txtbin.isBinString(v)) {
    m = 'bin';
  } else if (txtbin.isHexString(v) || txtbin.isPercentEncoding(v)) {
    m = 'hex';
  } else if (txtbin.isBase64String(v)) {
    m = 'b64';
  }
  txtbin.activeMode(m);
};

txtbin.isBinString = function(s) {
  return ((s.match(/^[01\s\n]+$/)) ? true : false);
};

txtbin.isHexString = function(s) {
  return ((s.match(/^[0-9A-Fa-f\s\n]+$/)) ? true : false);
};

txtbin.isBase64String = function(s) {
  return ((s.trim().match(/^(data:.+;base64,)?[A-Za-z0-9+/\s\n]+=*$/)) ? true : false);
};

txtbin.isPercentEncoding = function(s) {
  return ((s.match(/^\s*((%[0-9A-Fa-f]{2})\s*)+$/)) ? true : false);
};

txtbin.drawInfo = function(s) {
  $el('#info').innerHTML = s;
};

txtbin.str2buf = function(mode, s) {
  if ((mode == 'bin') || (mode == 'dec') || (mode == 'hex')) {
    s = txtbin.extractBinTextPart(mode, s);
  }
  var b;
  switch (mode) {
    case 'hex':
      b = txtbin.hex2uint8Array(s);
      break;
    case 'dec':
      b = txtbin.dec2uint8Array(s);
      break;
    case 'bin':
      b = txtbin.bin2uint8Array(s);
      break;
    case 'b64s':
      var k = $el('#key').value;
      b = util.decodeBase64s(s, k, true);
      break;
    case 'bsb64':
      var n = $el('#bsb64-n').value | 0;
      b = util.decodeBSB64(s, n, true);
      break;
    case 'txt':
      var b64 = util.encodeBase64(s);
      b = txtbin.b642uint8Array(b64);
      break;
    default:
      b = txtbin.b642uint8Array(s);
  }
  return b;
};

txtbin.getBufOfBase64s = function(buf) {
  var key = $el('#key').value;
  var b64s = util.encodeBase64s(buf, key);
  var b = util.decodeBase64(b64s, true);
  return b;
};

txtbin.getBufOfBSB64 = function(buf) {
  var n = $el('#bsb64-n').value | 0;
  var b64s = util.BSB64.encode(buf, n);
  var b = util.decodeBase64(b64s, true);
  return b;
};

txtbin.showPreview = function(bufCache) {
  if (!$el('#show-preview').checked) {
    txtbin.drawPreview('');
    return;
  }
  var ftype = (txtbin.bufCache ? txtbin.bufCache.ftype : null);
  var peviewMode = $el('#preview-mode').value;
  var peviewModeEncryption = $el('#preview-mode-encryption').value;
  $el('#copy-button').disabled = false;
  switch (peviewMode) {
    case 'bin':
    case 'dec':
    case 'hex':
      var buf = bufCache.buf;
      if (peviewModeEncryption == 'b64s') {
        buf = txtbin.getBufOfBase64s(buf);
      } else if (peviewModeEncryption == 'bsb64') {
        buf = txtbin.getBufOfBSB64(buf);
      }
      txtbin.showPreviewAsBin(peviewMode, buf);
      break;
    case 'b64':
      txtbin.showPreviewAsB64(bufCache);
      break;
    case 'b64s':
      txtbin.showPreviewAsB64s(bufCache);
      break;
    case 'bsb64':
      txtbin.showPreviewAsBSB64(bufCache);
      break;
    case 'txt':
      txtbin.showPreviewAsText(bufCache);
      break;
    default:
      txtbin.showPreviewAsView(bufCache);
      if (txtbin.isMedia(ftype)) {
        $el('#copy-button').disabled = true;
      }
  }
};

txtbin.showPreviewAsView = function(bufCache) {
  var ftype = bufCache.ftype;
  var b64 = bufCache.b64;
  var mimeClass = txtbin.getMimeClass(ftype);
  if (ftype.nopreview) {
    txtbin.showTextPreview(b64);
  } else {
    if (mimeClass == 'image') {
      txtbin.showImagePreview(b64, ftype);
    } else if (mimeClass == 'video') {
      txtbin.showVideoPreview(b64);
    } else if (mimeClass == 'audio') {
      txtbin.showAudioPreview(b64);
    } else if (ftype['ext'] == 'pdf') {
      txtbin.showPdfPreview(b64);
    } else {
      txtbin.showTextPreview(b64);
    }
  }
};

txtbin.showPreviewAsText = function(bufCache) {
  txtbin.showTextPreview(bufCache.b64);
};

txtbin.showPreviewAsBin = function(peviewMode, buf) {
  var r = txtbin.getBinDump(peviewMode, buf);
  txtbin.drawPreview(r);
};

txtbin.showPreviewAsB64 = function(bufCache) {
  var b64 = bufCache.b64;
  var r = txtbin.formatB64(b64);
  txtbin.drawPreview(r);
};

txtbin.showPreviewAsB64s = function(bufCache) {
  var buf = bufCache.buf;
  var key = $el('#key').value;
  var b64s = util.encodeBase64s(buf, key);
  var r = txtbin.formatB64(b64s);
  txtbin.drawPreview(r);
};

txtbin.showPreviewAsBSB64 = function(bufCache) {
  var buf = bufCache.buf;
  var n = $el('#bsb64-n').value | 0;
  var b64s = util.BSB64.encode(buf, n);
  var r = txtbin.formatB64(b64s);
  txtbin.drawPreview(r);
};

txtbin.showTextPreview = function(b64) {
  var s = util.decodeBase64(b64);
  s = util.escHtml(s);
  if ($el('#show-preview-cc').checked) {
    s = s.replace(/ /g, txtbin.SP);
    s = s.replace(/\r\n/g, txtbin.CHR_CRLF_S + '\n');
    s = s.replace(/([^>])\n/g, '$1' + txtbin.CHR_LF_S + '\n');
    s = s.replace(/\r/g, txtbin.CHR_CR_S + '\n');
    s = s.replace(/\t/g, txtbin.TAB);
    s = s.replace(/([\u0300-\u036F])(.)/g, txtbin.CDM + '$1 $2');
    s = s.replace(/\u3000/g, txtbin.FULL_SP);
    s = s.replace(/\u00A0/g, txtbin.NBSP);
    s = s.replace(/\u200B/g, txtbin.ZWSP);
    s = s.replace(/\u200E/g, txtbin.LRM);
    s = s.replace(/\u200F/g, txtbin.RLM);
    s = s.replace(/\u202A/g, txtbin.LRE);
    s = s.replace(/\u202B/g, txtbin.RLE);
    s = s.replace(/\u202C/g, txtbin.PDF);
    s = s.replace(/\u202D/g, txtbin.LRO);
    s = s.replace(/\u202E/g, txtbin.RLO);
    s = s.replace(/([\uFE00-\uFE0F])(.)/g, txtbin.VS + '$1$2');
    s = s.replace(/\uFEFF/g, txtbin.BOM);
    s = s.replace(/\u0000/g, txtbin.CHR_NULL);
    s = s.replace(/[\u0001-\u0008]|\u000B|\u000C|[\u000E-\u001A]|[\u001C-\u001F]/g, txtbin.CHR_CTRL);
    s = s.replace(/\u001B/g, txtbin.CHR_ESC);
    s = s.replace(/\u007F/g, txtbin.CHR_DELL);
    s = s + txtbin.EOF + '\n';
  }
  txtbin.drawPreview(s);
};

txtbin.showImagePreview = function(b64, ftype) {
  txtbin.resetFontSize4Preview();
  var mime = ftype.mime;
  var d = 'data:' + mime + ';base64,' + b64;
  var v = '<img id="img-preview" src="' + d + '" style="max-width:100%;max-height:calc(100% - 8px);" onmousedown="return false;">';
  txtbin.drawPreview(v);
  var id = 'img-preview';
  setTimeout(txtbin.postShowMediaPreview, 0, id);
  setTimeout(txtbin.postShowImgPreview, 0, id);
};
txtbin.postShowMediaPreview = function(id) {
  txtbin.mediaPreviewRect = $el('#' + id).getRect();
};
txtbin.postShowImgPreview = function(id) {
  $el('#' + id).addEventListener('mousedown', txtbin.startDragImg, {passive: true});
};

txtbin.isImageShowing = function() {
  if (!txtbin.bufCache) return false;
  var ftype = txtbin.bufCache.ftype;
  var peviewMode = $el('#preview-mode').value;
  return (txtbin.isImage(ftype) && (peviewMode == 'view'));
};

txtbin.startDragImg = function(e) {
  var x = e.clientX;
  var y = e.clientY;
  txtbin.uiStatus |= txtbin.UI_ST_DRAGGING;
  document.body.style.cursor = 'move';
  txtbin.disableTextSelect();
  txtbin.orgPos.x = x;
  txtbin.orgPos.y = y;
  txtbin.orgPrvScrl = txtbin.getPreviewScrollInfo();
};
txtbin.dragImg = function(x, y) {
  var dX = x - txtbin.orgPos.x;
  var dY = y - txtbin.orgPos.y;
  var l = txtbin.orgPrvScrl.l - dX;
  var t = txtbin.orgPrvScrl.t - dY;
  txtbin.setPreviewScroll(l, t);
};
txtbin.endDragImg = function(e) {
  txtbin.uiStatus &= ~txtbin.UI_ST_DRAGGING;
  txtbin.enableTextSelect();
  document.body.style.cursor = 'auto';
  txtbin.orgPos.x = 0;
  txtbin.orgPos.y = 0;
  txtbin.orgPrvScrl = null;
};

txtbin.onImgWheel = function(e) {
  if (!txtbin.isImageShowing()) return;
  var dY = e.deltaY;
  var dS = 2;
  if (dY == 0) return;
  if (dY > 0) dS *= (-1);
  var sz = txtbin.getFontSize4Preview() + dS;
  var sc0 = txtbin.getPreviewScrollInfo();
  txtbin.setFontSize4Preview(sz);
  var sc1 = txtbin.getPreviewScrollInfo();
  var dW = (sc1.w - sc0.w) / 2;
  var dH = (sc1.h - sc0.h) / 2;
  var l = sc1.l + dW;
  var t = sc1.t + dH;
  txtbin.setPreviewScroll(l, t);
  e.preventDefault();
};
txtbin.getPreviewScrollInfo = function() {
  var o = {
    w: $el('#preview-wrapper').scrollWidth,
    h: $el('#preview-wrapper').scrollHeight,
    l: $el('#preview-wrapper').scrollLeft,
    t: $el('#preview-wrapper').scrollTop
  };
  return o;
};
txtbin.setPreviewScroll = function(l, t) {
  $el('#preview-wrapper').scrollLeft = l;
  $el('#preview-wrapper').scrollTop = t;
};

txtbin.onPreviewDblClick = function() {
  if (!txtbin.prevWin && txtbin.isImageShowing()) txtbin.openPreviewWin();
};
txtbin.openPreviewWin = function() {
  var opt = {
    name: 'win1',
    draggable: true,
    resizable: true,
    maximize: true,
    pos: 'c',
    closeButton: true,
    width: 900,
    height: 600,
    scale: 1,
    title: {
      text: 'Preview'
    },
    body: {
      style: {
        background: '#111'
      }
    },
    oncreate: txtbin.onPrevWinCreate,
    onshow: txtbin.onPrevWinShow,
    onclose: txtbin.onPrevWinClose
  };

  txtbin.prevWin = util.newWindow(opt);
  txtbin.prevWin.max();
  txtbin.prevWin.body.appendChild($el('#preview-wrapper'));
};
txtbin.onPrevWinClose = function() {
  $el('#preview-wrapper0').appendChild($el('#preview-wrapper'));
  txtbin.prevWin = null;
  if (txtbin.isImageShowing()) txtbin.resetFontSize4Preview();
};

txtbin.showVideoPreview = function(b64) {
  var d = 'data:video/mp4;base64,' + b64;
  var v = '<video id="video-preview" src="' + d + '" style="max-width:100%;max-height:100%;" controls onmousedown="return false;">';
  txtbin.drawPreview(v);
  setTimeout(txtbin.postShowMediaPreview, 0, 'video-preview');
};

txtbin.showAudioPreview = function(b64) {
  var d = 'data:audio/wav;base64,' + b64;
  var v = '<audio src="' + d + '" style="max-width:100%;max-height:100%;" controls>';
  txtbin.drawPreview(v);
};

txtbin.showPdfPreview = function(b64) {
  var d = 'data:application/pdf;base64,' + b64;
  var v = '<embed src="' + d + '" style="width:100%;height:calc(100% - 2px);"></embed>';
  txtbin.drawPreview(v);
};

txtbin.drawPreview = function(s) {
  txtbin.mediaPreviewRect = null;
  $el('#preview').innerHTML = s;
  $el('#preview-area').scrollToTop();
  $el('#preview-area').scrollToLeft();
};

txtbin.confirmClear = function() {
  var v = txtbin.getSrcValue();
  if (v && !txtbin.bufCache) {
    util.confirm('Clear?', txtbin.clear);
  } else {
    txtbin.clear();
  }
};

txtbin.clear = function() {
  txtbin.clearBuf();
  txtbin.setSrcValue('', true);
  txtbin.drawInfo('<span style="color:#888;">CONTENT INFO</span>');
  txtbin.drawPreview('<span style="color:#888;">PREVIEW</span>');
  $el('#src').focus();
};

txtbin.clearBuf = function() {
  txtbin.bufCache = null;
  txtbin.file = null;
  $el('#key-update-button').disabled = true;
  $el('#copy-button').disabled = true;
};

txtbin.submit = function() {
  var v = ''
  var mode = txtbin.getMode();
  switch (mode) {
    case 'b64s':
      v  = $el('#key').value;
      break;
    case 'bsb64':
      v = $el('#bsb64-n').value;
      break;
  }
  $el('#h-key').value = v;
  document.f1.submit();
};

txtbin.str2arr = function(s) {
  return s.match(/[\uD800-\uDBFF][\uDC00-\uDFFF]|[\s\S]/g) || [];
};

txtbin.onFontRangeChanged = function(el) {
  var v = el.value;
  txtbin.setFontSize(v);
};
txtbin.setFontSize = function(v) {
  var fontSize = v + 'px';
  $el('#font-range').value = v;
  $el('#src').style.fontSize = fontSize;
  $el('#fontsize').innerHTML = fontSize;
};
txtbin.resetFontSize = function() {
  txtbin.setFontSize(txtbin.DEFAULT_FONT_SIZE);
};

txtbin.onFontRangeChanged4Preview = function(el) {
  var v = el.value;
  txtbin.setFontSize4Preview(v);
};
txtbin.setFontSize4Preview = function(v) {
  var fontSize = v + 'px';
  $el('#font-range-preview').value = v;
  $el('#preview').style.fontSize = fontSize;
  $el('#fontsize-preview').innerHTML = fontSize;
  if (txtbin.mediaPreviewRect) {
    var el = null;
    if ($el('#img-preview').exists()) {
      el = $el('#img-preview');
    } else if ($el('#video-preview').exists()) {
      el = $el('#video-preview');
    }
    if (el) {
      txtbin.resizeMediaPreview(el, v);
    }
  }
};
txtbin.getFontSize4Preview = function() {
  return $el('#font-range-preview').value | 0;
};
txtbin.resizeMediaPreview = function(el, v) {
  var orgW = txtbin.mediaPreviewRect.width;
  var orgH = txtbin.mediaPreviewRect.height;
  var srcV = orgW;
  var prop = 'width';
  if (orgW < orgH) {
    srcV = orgH;
    prop = 'height';
  }
  var p = (v / 14) * srcV;
  el.style[prop] = p + 'px';
  el.style['max-width'] = '';
  el.style['max-height'] = '';
};
txtbin.resetFontSize4Preview = function() {
  txtbin.setFontSize4Preview(txtbin.DEFAULT_FONT_SIZE);
};
txtbin.fontFamily4Preview = '';
txtbin.onFontChanged4Preview = function(el) {
  var v = el.value;
  txtbin.fontFamily4Preview = v;
  txtbin._setFont4Preview(v);
};
txtbin.setFont4Preview = function(n) {
  $el('#font-preview').value = n;
  txtbin._setFont4Preview(n);
};
txtbin._setFont4Preview = function(v) {
  $el('#preview').style.fontFamily = v;
};

txtbin.changeFont4Preview = function(n) {
  txtbin.setFont4Preview(n);
  txtbin.fontFamily4Preview = n;
};

txtbin.fontFamily = '';
txtbin.onFontChanged = function(el) {
  var v = el.value;
  txtbin.fontFamily = v;
  txtbin._setFont(v);
};
txtbin.setFont = function(n) {
  $el('#font').value = n;
  txtbin._setFont(n);
};
txtbin._setFont = function(v) {
  $el('#src').style.fontFamily = v;
};
txtbin.changeFont = function(n) {
  txtbin.setFont(n);
  txtbin.fontFamily = n;
};

txtbin.switchKeyViewHide = function() {
  var type = (($el('#key').type == 'text') ? 'password' : 'text');
  $el('#key').type = type;
  if (type == 'password') {
    $el('#key-hide-button').removeClass('button-inactive');
  } else {
    $el('#key-hide-button').addClass('button-inactive');
  }
};

txtbin.updateB64sKey = function() {
  var mode = txtbin.getMode();
  var peviewMode = $el('#preview-mode').value;
  var peviewModeEncryption = $el('#preview-mode-encryption').value;
  if (txtbin.bufCache) {
    if (mode == 'b64s') {
      txtbin.switchRadix(mode, txtbin.bufCache);
    }
    if ((peviewMode != 'view') && (peviewMode != 'txt') && (peviewModeEncryption == 'b64s')) {
      txtbin.showPreview(txtbin.bufCache);
    }
  }
};

txtbin.onInputKey = function() {
  if ($el('#b64-auto-update').checked) {
    txtbin.updateB64sKey();
  }
};

txtbin.onChangeBsb64N = function() {
  var mode = txtbin.getMode();
  var peviewMode = $el('#preview-mode').value;
  var peviewModeEncryption = $el('#preview-mode-encryption').value;
  if (txtbin.bufCache) {
    if (mode == 'bsb64') {
      txtbin.switchRadix(mode, txtbin.bufCache);
    }
    if ((peviewMode != 'view') && (peviewMode != 'txt') && (peviewModeEncryption == 'bsb64')) {
      txtbin.showPreview(txtbin.bufCache);
    }
  }
};

txtbin.onMouseMove = function(e) {
  var x = e.clientX;
  var y = e.clientY;
  if (txtbin.uiStatus == txtbin.UI_ST_AREA_RESIZING_X) {
    txtbin.onAreaResizeX(x);
  } else if (txtbin.uiStatus == txtbin.UI_ST_AREA_RESIZING_Y) {
    txtbin.onAreaResizeY(y);
  } else if (txtbin.uiStatus & txtbin.UI_ST_DRAGGING) {
    txtbin.dragImg(x, y);
  }
};
txtbin.onMouseUp = function(e) {
  switch (e.button) {
    case 0:
      if ((txtbin.uiStatus == txtbin.UI_ST_AREA_RESIZING_X) || (txtbin.uiStatus == txtbin.UI_ST_AREA_RESIZING_Y)) {
        txtbin.onAreaResizeEnd(e);
      } else if (txtbin.uiStatus & txtbin.UI_ST_DRAGGING) {
        txtbin.endDragImg(e);
      }
  }
};

txtbin.copyPreview = function() {
  var previewMode = $el('#preview-mode').value;
  if (txtbin.bufCache && ((previewMode == 'view') || (previewMode == 'txt'))) {
    var b64 = txtbin.bufCache.b64;
    var s = util.decodeBase64(b64);
  } else {
    s = $el('#preview').innerText;
  }
  util.copy(s);
  var o = {
    pos: 'pointer',
    style: {
      'font-size': '18px'
    }
  };
  util.infotip.show('Copied', o);
};

txtbin.getSelfSizePos = function(el) {
  var rect = el.getBoundingClientRect();
  var resizeBoxSize = 6;
  var sp = {};
  sp.w = el.clientWidth;
  sp.h = el.clientHeight;
  sp.x1 = rect.left - resizeBoxSize / 2;
  sp.y1 = rect.top - resizeBoxSize / 2;
  sp.x2 = sp.x1 + el.clientWidth;
  sp.y2 = sp.y1 + el.clientHeight;
  return sp;
};

txtbin.nop = function() {
  return false;
};
txtbin.disableTextSelect = function() {
  document.onselectstart = txtbin.nop;
};
txtbin.enableTextSelect = function() {
  document.onselectstart = txtbin.onselectstart;
};

txtbin.storeAreaSize = function() {
  var sp1 = txtbin.getSelfSizePos($el('#input-area'));
  var adj = 8;
  var w1 = sp1.w + adj;

  sp1 = txtbin.getSelfSizePos($el('#info-area'));
  adj = 8;
  var h1 = sp1.h + adj;

  txtbin.orgSize = {
    a1: {w: w1},
    a2: {h: h1}
  };
};

txtbin.onAreaResizeStartX = function(e) {
  txtbin.onAreaResizeStart(e, 0, 'X', txtbin.UI_ST_AREA_RESIZING_X, $el('#input-area'), $el('#right-area'), 'ew-resize');
};
txtbin.onAreaResizeX = function(x) {
  var adj = 8;
  var dX = txtbin.areaSize[0].orgX - x;
  var w1 = txtbin.areaSize[0].orgSP1.w - dX - adj;
  var dW = txtbin.areaSize[0].orgDW - dX;
  txtbin.areaSize[0].dW = dW;
  var bw = document.body.clientWidth;
  if ((w1 < 200) || (w1 > (bw - 200))) {
    return;
  }
  txtbin.setAreaSizeX(w1, dW);
};
txtbin.resetAreaSizeX = function() {
  txtbin.setAreaSizeX(txtbin.orgSize.a1.w, 0);
  txtbin.areaSize[0].orgDW = 0;
  txtbin.areaSize[0].dW = 0;
};
txtbin.setAreaSizeX = function(w1, dW) {
  txtbin._setAreaSizeX($el('#input-area'), $el('#right-area'), w1, dW, 28);
};
txtbin._setAreaSizeX = function(el1, el2, w1, dW, adj2) {
  var adj = 8;
  var w2 = w1 + adj2;
  el1.style.width = w1 + adj + 'px';
  el2.style.width = 'calc(100% - ' + w2 + 'px)';
};

txtbin.onAreaResizeStartY = function(e) {
  txtbin.onAreaResizeStart(e, 1, 'Y', txtbin.UI_ST_AREA_RESIZING_Y, $el('#info-area'), $el('#preview-area'), 'ns-resize');
};
txtbin.onAreaResizeY = function(y) {
  var adj = 12;
  var dY = txtbin.areaSize[1].orgY - y;
  var h1 = txtbin.areaSize[1].orgSP1.h - dY - adj;
  var h2 = txtbin.areaSize[1].orgSP2.h + dY - adj;
  var dH = txtbin.areaSize[1].orgDH - dY;
  txtbin.areaSize[1].dH = dH;
  if ((h1 < 100) || ((h2 < 100))) {
    return;
  }
  txtbin.setAreaSizeY(h1, dH);
};
txtbin.resetAreaSizeY = function() {
  txtbin.setAreaSizeY(txtbin.orgSize.a2.h, 0);
  txtbin.areaSize[1].orgDH = 0;
  txtbin.areaSize[1].dH = 0;
};
txtbin.setAreaSizeY = function(h1, dH) {
  txtbin._setAreaSizeY($el('#info-area'), $el('#preview-area'), h1, dH, 56);
};
txtbin._setAreaSizeY = function(el1, el2, h1, dH, adj2) {
  var adj = 8;
  var h2 = h1 + adj2;
  el1.style.height = h1 + adj + 'px';
  el2.style.height = 'calc(100% - ' + h2 + 'px)';
};

txtbin.onAreaResizeStart = function(e, idx, dir, uiStatus, el1, el2, cursor) {
  txtbin.uiStatus = uiStatus;
  var x = e.clientX;
  var y = e.clientY;
  var sp1 = txtbin.getSelfSizePos(el1);
  var sp2 = txtbin.getSelfSizePos(el2);
  txtbin.areaSize[idx].orgSP1 = sp1;
  txtbin.areaSize[idx].orgSP2 = sp2;
  txtbin.disableTextSelect();
  document.body.style.cursor = cursor;
  if (dir == 'X') {
    txtbin.areaSize[idx].orgX = x;
    txtbin.areaSize[idx].orgDW = txtbin.areaSize[0].dW;
  } else {
    txtbin.areaSize[idx].orgY = y;
    txtbin.areaSize[idx].orgDH = txtbin.areaSize[idx].dH;
  }
};
txtbin.onAreaResizeEnd = function(e) {
  txtbin.enableTextSelect();
  document.body.style.cursor = 'auto';
  txtbin.uiStatus = txtbin.UI_ST_NONE;
};

txtbin.TXT_EDIT_FN = [
  {lbl: ''},
  {lbl: 'CLEANSE_TEXT', opt: [{lbl: 'NBSP', optvals: [{v: 'Y'}, {v: 'N'}]}, {lbl: 'ZWSP', optvals: [{v: 'Y'}, {v: 'N'}]}], fn: function(s, o) {return DebugJS.cleanseText(s, (o[0] == 'Y'), (o[1] == 'Y'));}},
  {lbl: 'DATE_TIME_SEP', opt: [{lbl: 'SEPARATOR', v: '/'}], fn: function(s, o) {return DebugJS.dateSep(s, o[0]);}},
  {lbl: 'DELIMIT', opt: [{lbl: 'POS', v: ''}, {lbl: 'ORG', optvals: [{v: '0'}, {v: '1', s: 1}]}, {lbl: 'TRIM', optvals: [{v: 'Y'}, {v: 'N'}]}],
    fn: function(s, o) {
      var pos = o[0].replace(/\s{2,}/g, ' ').replace(/,/g, ' ').split(' ');
      return DebugJS.delimit(s, pos, o[1] | 0, '\t', (o[2] == 'Y'));
    }
  },
  {
    lbl: 'HALF/FULL', opt: [{lbl: '', optvals: [{t: 'HALF', v: 'H'}, {t: 'FULL', v: 'F'}]}],
    fn: function(s, o) {return (o[0] == 'H' ? DebugJS.toHalfWidth(s) : DebugJS.toFullWidth(s));}
  },
  {lbl: 'HORIZ_VERT', opt: [{lbl: '', optvals: [{t: 'H2V', v: '0'}, {t: 'V2H', v: '1'}]}], fn: function(s, o) {return (+o[0] ? s.replace(/\n/g, '\t') : s.replace(/\t/g, '\n'));}},
  {lbl: 'JSON', opt: [{lbl: 'INDENT', v: '1'}],
    fn: function(s, o) {
      try {var j = DebugJS.formatJSON(s, +o[0]);} catch (e) {j = '[ERROR]' + e + '\n' + s;}
      return j;
    }
  },
  {
    lbl: 'lower/UPPER', opt: [{lbl: '', optvals: [{t: 'lower', v: 'L'}, {t: 'UPPER', v: 'U'}]}],
    fn: function(s, o) {return (o[0] == 'U' ? s.toUpperCase() : s.toLowerCase());}
  },
  {lbl: 'MAX_MIN_LEN', opt: [{lbl: 'THRESHOLD'}], fn: function(s, o) {return DebugJS.minMaxLen(s, o[0]);}},
  {
    lbl: 'NEWLINE', opt: [{lbl: '', optvals: [{t: 'DEL', v: '0'}, {t: 'AGG', v: '1', s: 1}, {t: 'DBL', v: '2'}, {t: 'INS', v: '3'}]}, {lbl: 'POS', v: '76'}],
    fn: function(s, o) {
      var f = DebugJS.lflf2lf;
      if (o[0] == 0) {
        f = DebugJS.deleteLF;
      } else if (o[0] == 2) {
        f = DebugJS.lf2lflf;
      } else if (o[0] == 3) {
        return DebugJS.insertCh(s, '\n', o[1] | 0);
      }
      return f(s);
    }
  },
  {lbl: 'NUMBERING', opt: [{lbl: 'ST', v: '1'}, {lbl: 'ED'}, {lbl: 'LEN'}], fn: function(s, o) {return DebugJS.numbering(s, o[0], o[1], o[2]);}},
  {
    lbl: 'PADDING', opt: [{lbl: 'TO', optvals: [{t: 'LEFT', v: 'L'}, {t: 'RIGHT', v: 'R'}]}, {lbl: 'CHAR', v: '0'}, {lbl: 'LEN'}],
    fn: function(s, o) {
      var f = ((o[0] == 'L') ? DebugJS.lpad : DebugJS.rpad);
      var a = DebugJS.txt2arr(s);
      if (a.length == 0) return f('', o[1], o[2]);
      var r = '';
      for (var i = 0; i < a.length; i++) {
        if (i > 0) r += '\n';
        var b = a[i].split('\t');
        for (var j = 0; j < b.length; j++) {
          if (j > 0) r += '\t';
          r += f(b[j], o[1], o[2]);
        }
      }
      return r;
    }
  },
  {
    lbl: 'PADDING_SEQ', opt: [{lbl: 'LEN'}, {lbl: 'H/F', optvals: [{t: 'AUTO', v: '0'}, {t: 'HALF', v: '1'}, {t: 'FULL', v: '2'}]}],
    fn: function(s, o) {
      var a = DebugJS.txt2arr(s);
      if (a.length == 0) return DebugJS.padSeq(s, o[0] | 0, o[1] | 0);
      var r = '';
      for (var i = 0; i < a.length; i++) {
        if (i > 0) r += '\n';
        var b = a[i].split('\t');
        for (var j = 0; j < b.length; j++) {
          if (j > 0) r += '\t';
          r += DebugJS.padSeq(b[j], o[0] | 0, o[1] | 0);
        }
      }
      return r;
    }
  },
  {
    lbl: 'REPLACE', opt: [{lbl: 'FM'}, {lbl: 'TO'}, {lbl: 'RE', optvals: [{v: 'N'}, {v: 'Y'}]}, {lbl: 'FLG', v: 'gi'}],
    fn: function(s, o) {
      try {
        var fm = o[0];
        if (o[2] != 'Y') fm = fm.replace(/([()/[\].+*?^$-])/g, '\\$1');
        fm = new RegExp(fm, o[3]);
        s = s.replace(fm, o[1]);
      } catch (e) {
        s = '[ERROR]' + e + '\n' + s;
      }
      return s;
    }
  },
  {lbl: 'ROT', opt: [{lbl: 'X', optvals: [{v: '5'}, {v: '13'}, {v: '18', s: 1}, {v: '47'}]}, {lbl: 'SHIFT'}], fn: function(s, o) {return DebugJS.rot(o[0], s, o[1]);}},
  {
    lbl: 'SORT', opt: [{lbl: '', optvals: [{t: 'ASC', v: 'A'}, {t: 'DESC', v: 'D'}]}, {lbl: 'COL'}, {lbl: 'ASNUM', optvals: [{v: 'Y'}, {v: 'N'}]}],
    fn: function(s, o) {return DebugJS.sort(s, (o[0] == 'D' ? 1 : 0), o[1] | 0, (o[2] == 'Y' ? 1 : 0));}
  },
  {lbl: 'SUM', fn: function(s) {return DebugJS.sum(s);}},
  {lbl: 'TAB_ALIGN', opt: [{lbl: 'SPACE', v: '2'}], fn: function(s, o) {return DebugJS.alignByTab(s, o[0] | 0);}},
  {lbl: 'TIME_CONV', fn: function(s) {return DebugJS.timecnv(s);}},
  {
    lbl: 'UNIQUE', opt: [{lbl: 'SORT', optvals: [{t: '', v: ''}, {t: 'ASC', v: 'A'}, {t: 'DESC', v: 'D'}]}, {lbl: 'COUNT', optvals: [{v: 'N'}, {v: 'Y'}]}],
    fn: function(s, o) {
      var opt = {sort: o[0], count: (o[1] == 'Y' ? 1 : 0), blank: 0};
      return DebugJS.toUnique(s, opt).r;
    }
  },
  {lbl: 'XML', opt: [{lbl: 'INDENT', v: '2'}, {lbl: 'COMMENT', optvals: [{v: 'Y'}, {v: 'N'}]}], fn: function(s, o) {return DebugJS.formatXml(s, o[0], (o[1] == 'Y' ? 0 : 1));}},
  {lbl: '%XX', opt: [{lbl: '', optvals: [{t: 'Decode', v: 'D'}, {t: 'Encode', v: 'E'}]}], fn: function(s, o) {var f = o[0] == 'E' ? 'encodeUri' : 'decodeUri';return DebugJS[f](s);}},
  {lbl: '&#n;', opt: [{lbl: '', optvals: [{t: 'Decode', v: 'D'}, {t: 'Encode', v: 'E'}]}], fn: function(s, o) {var f = o[0] == 'E' ? 'encodeChrEntRefs' : 'decodeChrEntRefs';return DebugJS[f](s);}}
];

txtbin.txtEdtOptEl = [];
txtbin.initTxtEditMode = function() {
  var o = '';
  for (var i = 0; i < txtbin.TXT_EDIT_FN.length; i++) {
    o += '<option value="' + i + '">' + txtbin.TXT_EDIT_FN[i].lbl + '</option>';
  }
  $el('#txt-edit-mode').innerHTML = o;
  $el('#txt-edit-mode').addEventListener('change', txtbin.onTxtEdtMdChg);
  var basePanel = $el('#txt-edit-opts');
  for (i = 0; i < 4; i++) {
    txtbin.txtEdtOptEl[i] = {
      lbl: DebugJS.ui.addLabel(basePanel, '', {'margin-left': '4px'}),
      txt: DebugJS.ui.addTextInput(basePanel, '3em', 'left', '#ccc', '', null),
      sel: DebugJS.ui.addElement(basePanel, 'select')
    };
  }
  txtbin.onTxtEdtMdChg();
};

txtbin.onTxtEdtMdChg = function() {
  var v = $el('#txt-edit-mode').value | 0;
  var d = txtbin.TXT_EDIT_FN[v];
  for (var i = 0; i < 4; i++) {
    var optEl = txtbin.txtEdtOptEl;
    DebugJS.hideEl(optEl[i].lbl);
    DebugJS.hideEl(optEl[i].txt);
    DebugJS.hideEl(optEl[i].sel);
    optEl[i].sel.active = false;
    if (d.opt && d.opt[i]) {
      var oDef = d.opt[i];
      optEl[i].lbl.innerText = oDef.lbl + ': ';
      optEl[i].txt.value = (oDef.v ? oDef.v : '');
      DebugJS.showEl(optEl[i].lbl);
      DebugJS.showEl(optEl[i].txt);
      if (oDef.optvals) {
        var sel = optEl[i].sel;
        DebugJS.hideEl(optEl[i].txt);
        DebugJS.showEl(sel);
        sel.active = true;
        var o = '';
        for (var j = 0; j < oDef.optvals.length; j++) {
          var ov = oDef.optvals[j];
          o += '<option value="' + ov.v + '"';
          if (ov.s) o += ' selected';
          o += '>' + ((ov.t == undefined) ? ov.v : ov.t) + '</option>';
        }
        sel.innerHTML = o;
      }
    }
  }
};
txtbin.execTxtEdit = function() {
  var idx = $el('#txt-edit-mode').value | 0;
  var d = txtbin.TXT_EDIT_FN[idx];
  if (!d.fn) return;
  var s = txtbin.getSrcValue();
  var o = [];
  for (var i = 0; i < 4; i++) {
    var oEls = txtbin.txtEdtOptEl[i];
    o[i] = oEls.txt.value;
    if (oEls.sel.active) o[i] = oEls.sel.value;
  }
  var v = d.fn(s, o);
  v = DebugJS.escHtml(v);
  txtbin.drawPreview(v);
  $el('#copy-button').disabled = false;
  txtbin.bufCache = null;
};

txtbin.UTF8 = {};
txtbin.UTF8.toByteArray = function(s) {
  var a = [];
  if (!s) return a;
  var chs = txtbin.str2arr(s);
  for (var i = 0; i < chs.length; i++) {
    var ch = chs[i];
    var c = ch.charCodeAt(0);
    if (c <= 0x7F) {
      a.push(c);
    } else {
      var e = encodeURIComponent(ch);
      var w = e.split('%');
      for (var j = 1; j < w.length; j++) {
        a.push(('0x' + w[j]) | 0);
      }
    }
  }
  return a;
};
txtbin.UTF8.fromByteArray = function(b) {
  if (!b) return null;
  var e = '';
  for (var i = 0; i < b.length; i++) {
    e += '%' + txtbin.toHex(b[i], true, '', 2);
  }
  return decodeURIComponent(e);
};

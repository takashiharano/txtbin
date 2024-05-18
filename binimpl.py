###############################################################################
# Binary Decoder
# Copyright (c) 2023 Takashi Harano
###############################################################################

import sys
import os

ROOT_DIR = '../'

sys.path.append(os.path.join(os.path.dirname(__file__), ROOT_DIR + 'libs'))
import util
import bsb64

BASE_FILE_NAME = 'a'
MAX_SIZE = 20 * 1024 * 1024

FILETYPES = {
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
    'msg': {'head': 'D0 CF 11 E0 A1 B1 1A E1', 'mime': 'application/octet-stream', 'ext': 'msg'},
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
}

def deccode_and_send_file(mode, s):
    func_name = 'dec_' + mode
    fn = None
    g = globals()
    if func_name in g:
        fn = g[func_name]

    try:
        b = fn(s)
        ftype = get_file_type(b)
        ext = ftype['ext']
        filename = BASE_FILE_NAME + '.' + ext

    except Exception as e:
        txt = 'ERROR: mode=' + mode + '\n' + str(e)
        b = txt.encode()
        filename='error.txt'

    size = len(b)
    if MAX_SIZE > 0 and size > MAX_SIZE:
        txt = 'ERROR: size=' + str(size) + ' / MAX_SIZE=' + str(MAX_SIZE)
        b = txt.encode()
        filename='error.txt'

    now = util.now()
    timestamp = str(now).split('.')
    etag = timestamp[0] + '.' + (timestamp[1] + '00000')[:6]

    util.send_binary(b, filename=filename, etag=etag)

def extract_bintext_part(mode, s):
  if mode == 'bin':
      unit = 8
  elif mode == 'dec':
      unit = 3
  else:
      unit = 2

  v_start = 11
  v_end = v_start + (unit * 16) + 16
  s = s.strip()
  s = util.replace(s, '\\+', ' ')
  if not s.upper().startswith('ADDRESS'):
      return s
  a = util.text2list(s)
  b = ''
  for i in range(2, len(a)):
      l = a[i]
      w = l[v_start:v_end]
      b += w + '\n'
  b = b.strip()
  return b

def dec_bin(s):
    s = extract_bintext_part('bin', s)
    s = util.remove_space_newline(s)
    s = util.replace(s, '%', '')
    b = util.bin2bytes(s)
    return b

def dec_dec(s):
    s = extract_bintext_part('dec', s)
    s = util.replace(s, '\\n', ' ')
    s = util.replace(s, '%', '')
    s = util.replace(s, r' {2,}', ' ')
    a = s.split(' ')
    b = bytearray()
    for i in range(len(a)):
        v = int(a[i])
        b.append(v)
    return b

def dec_hex(s):
    s = extract_bintext_part('hex', s)
    s = util.remove_space_newline(s)
    s = util.replace(s, '%', '')
    b = util.hex2bytes(s)
    return b

def dec_b64(s):
    s = util.remove_space_newline(s)
    if s.startswith('data:'):
        p = s.find(',')
        if p > 0:
            s = s[(p + 1):]
    b = util.decode_base64(s, bin=True)
    return b

def dec_b64s(s):
    key = util.get_request_param('key', '')
    s = util.remove_space_newline(s)
    if s.startswith('data:'):
        p = s.find(',')
        if p > 0:
            s = s[(p + 1):]
    b = util.decode_base64s(s, key, bin=True)
    return b

def dec_bsb64(s):
    n = util.get_request_param_as_int('key', 1)
    s = util.remove_space_newline(s)
    if s.startswith('data:'):
        p = s.find(',')
        if p > 0:
            s = s[(p + 1):]
    b = bsb64.decode(s, n)
    return b

def dec_txt(s):
    return s.encode()

def get_file_type(b):
    tp = {
        'mime': 'text/plain',
        'ext': 'txt'
    }
    mime = 'text/plain'
    ext = 'txt'
    for k in FILETYPES:
        ftype = FILETYPES[k]
        if 'head' not in ftype:
            continue

        if _has_binary_pattern(b, 0, ftype['head']):
            tp = ftype
            break

    if tp['mime'] == 'application/x-zip-compressed':
        w = get_zip_content_type(b)
        if w is not None:
            tp = w

    return tp

def has_binary_pattern(buf, binptn):
    ptn = binptn.split(' ')
    if len(buf) < len(ptn):
        return False

    for i in range(len(buf)):
        if _has_binary_pattern(buf, i, binptn):
            return True

    return False

def _has_binary_pattern(buf, pos, binptn):
    if util.typename(binptn) == 'list':
        for i in range(len(binptn)):
            if __has_binary_pattern(buf, pos, binptn[i]):
                return True
    else:
        return __has_binary_pattern(buf, pos, binptn)
    return False

def __has_binary_pattern(buf, pos, binptn):
    ptn = binptn.split(' ')
    if len(buf) < len(ptn):
        return False
    for i in range(len(ptn)):
        hex = ptn[i]
        if hex == 'xx':
            continue
        v = int('0x' + hex, 16)
        if v != buf[i + pos]:
            return False
    return True

def get_zip_content_type(buf):
    for k in FILETYPES:
        ftype = FILETYPES[k]
        if not 'hexptn' in ftype:
            continue
        if ftype['supertype'] == 'zip':
            if has_binary_pattern(buf, ftype['hexptn']):
                return ftype
    return None

def main():
    m = util.get_request_param('mode', '')
    s = util.get_request_param('src', '')
    deccode_and_send_file(m, s)

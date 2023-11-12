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

def deccode_and_send_file(mode, s):
    func_name = 'dec_' + mode
    fn = None
    g = globals()
    if func_name in g:
        fn = g[func_name]

    try:
        b = fn(s)
        ft = get_file_type(b)
        ext = ft['ext']
        info = ''
        if ft['info'] is not None:
            info = '-' + ft['info']
        filename = BASE_FILE_NAME + info + '.' + ext

    except Exception as e:
        txt = 'ERROR: ' + str(e)
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
  unit = 8 if mode == 'bin' else 2
  v_start = 11
  v_end = v_start + (unit * 16) + 16
  s = s.strip();
  if not s.upper().startswith('ADDRESS'):
      return s
  a = util.text2list(s)
  b = ''
  for i in range(2, len(a)):
      l = a[i]
      w = l[v_start:v_end]
      b += w + '\n'
  return b

def dec_hex(s):
    s = extract_bintext_part('hex', s)
    s = util.remove_space_newline(s)
    s = util.replace(s, '\\+', '')
    s = util.replace(s, '%', '')
    b = util.hex2bytes(s)
    return b

def dec_bin(s):
    s = extract_bintext_part('bin', s)
    s = util.remove_space_newline(s)
    s = util.replace(s, '\\+', '')
    s = util.replace(s, '%', '')
    b = util.bin2bytes(s)
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
    n = util.get_request_param_as_int('n', 1)
    s = util.remove_space_newline(s)
    if s.startswith('data:'):
        p = s.find(',')
        if p > 0:
            s = s[(p + 1):]
    b = bsb64.decode(s, n)
    return b

def get_ext(b):
    ft = get_file_type(b)
    if ft == '':
        ext = 'txt'
    else:
        ext = ft
    return ext

def get_file_type(b):
    filetypes = {
        'bmp': '42 4D',
        'class': 'CA FE BA BE',
        'exe': '4D 5A',
        'gif': '47 49 46 38',
        'gz': '1F 8B',
        'html': '3C 21 44 4F 43 54 59 50 45 20 68 74 6D 6C',
        'jpg': 'FF D8',
        'mp3': '49 44 33',
        'mp4': 'xx xx xx xx 66 74 79 70',
        'msg': 'D0 CF 11 E0 A1 B1 1A E1',
        'pdf': '25 50 44 46 2D',
        'png': '89 50 4E 47 0D 0A 1A 0A 00',
        'txt-utf8-bom': 'EF BB BF',
        'txt-utf16be-bom': 'FE FF',
        'txt-utf16le-bom': 'FF FE',
        'wav': '52 49 46 46 B6 72 06 00 57 41 56 45 66 6D 74',
        'webp': '52 49 46 46 xx xx xx xx 57 45 42 50',
        'xml': '3C 3F 78 6D 6C 20',
        'zip': '50 4B'
    }

    a = bytearray(b)

    tp = {
        'ext': 'txt',
        'info': None
    }
    for k in filetypes:
        ptn = filetypes[k]
        if match_header(ptn, a):
            if k.startswith('txt'):
                tp['ext'] = 'txt'
                tp['info'] = k[4:]
            else:
                tp['ext'] = k
            break
    return tp

def match_header(ptn, a):
    head = ptn.split(' ')
    if len(a) < len(head):
        return False
    for i in range(len(head)):
        hex = head[i]
        if hex == 'xx':
            continue
        v = int('0x' + hex, 0)
        if v != a[i]:
            return False
    return True

def main():
    m = util.get_request_param('mode', '')
    s = util.get_request_param('src', '')
    deccode_and_send_file(m, s)

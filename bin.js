var bin = {};
bin.CHR_LF = '.';
bin.CHR_CR = '_';

bin.auto = true;
$onReady = function() {
  util.textarea.addStatusInfo('#src', '#textareainfo');

  var opt = {
    mode: 'blob'
  };
  bin.dndHandler = util.addDndHandler('#src', bin.onDnd, opt);

  bin.setMode('auto');
  bin.activeMode('b64');

  $el('#src').addEventListener('input', bin.onInput);
  $el('#src').addEventListener('change', bin.onInput);
  $el('#src').focus();
};

bin.getMode = function() {
  return $el('#mode').value;
};

bin.isB64Mode = function() {
  var mode = bin.getMode();
  if ((mode == 'b64') || (mode == 'b64s') || (mode == 'bsb64')) {
    return true;
  }
  return false;
};

bin.setMode = function(mode, onlyMode) {
  if (mode != 'auto') {
    bin.setDndHandlerMode(mode);
    $el('#mode').value = mode;
    $el('.mode-ind').removeClass('mode-ind-active');
    $el('#mode-ind-' + mode).addClass('mode-ind-active');
  }

  $el('#key-label').addClass('label-disabled');
  $el('#key').disabled = true;
  $el('#key').addClass('input-disabled');
  $el('#n-label').addClass('label-disabled');
  $el('#n').disabled = true;

  if (mode == 'b64s') {
    $el('#key-label').removeClass('label-disabled');
    $el('#key').disabled = false;
    $el('#key').removeClass('input-disabled');
  } else if (mode == 'bsb64') {
    $el('#n-label').removeClass('label-disabled');
    $el('#n').disabled = false;
  }

  if (onlyMode) return;
  $el('.mode-button').removeClass('mode-active');
  $el('#mode-button-' + mode).addClass('mode-active');
  bin.auto = (mode == 'auto');
  if (mode == 'auto') {
    bin.onAutoMode();
  }
};

bin.onAutoMode = function() {
  bin.detectCurrentMode();
};

bin.activeMode = function(mode) {
  bin.setMode(mode, true);
};

bin.setDndHandlerMode = function(mode) {
  if ((mode == 'b64') || (mode == 'b64s') || (mode == 'bsb64')) {
    bin.dndHandler.setMode('data');
  } else {
    bin.dndHandler.setMode('blob');
  }
};

bin.onDnd = function(s, f) {
  if ((s instanceof ArrayBuffer) || (f && bin.isB64Mode())) {
    bin.dump(s);
  } else {
    $el('#src').value = s;
  }
};

bin.dump = function(s) {
  var mode = bin.getMode();
  var r;
  switch (mode) {
    case 'hex':
    case 'bin':
      var buf = new Uint8Array(s);
      r = bin.getHexDump(mode, buf);
      break;
    default:
      r = bin.formatB64(s);
      buf = bin.decodeBase64(s);
  }
  bin.drawBinInfo(buf);
  $el('#src').value = r;
};

bin.decodeBase64 = function(s) {
  if (s.startsWith('data:')) {
    var a = s.split(',');
    s = a[1];
  }
  return util.decodeBase64(s, true);
};

bin.drawBinInfo = function(buf) {
  var s =  bin.getBinTypeInfo(buf);
  s += '\n';
  s += bin.getHashInfo(buf);
  bin.drawInfo(s);
};

bin.getBinTypeInfo = function(b) {
  var tp = bin.getFileType(b);
  var s = 'Type    : .' + tp.ext;
  if (tp.info) s += ' / ' + tp.info;
  return s;
}

bin.getHashInfo = function(b) {
  var s = 'SHA-1   : ' + bin.getSHA('SHA-1', b, 1) + '\n';
  s += 'SHA-256 : ' + bin.getSHA('SHA-256', b, 1) + '\n';
  s += 'SHA-512 : ' + bin.getSHA('SHA-512', b, 1);
  return s;
};

bin.getSHA = function(a, b, f) {
  var s = new window.jsSHA(a, (f ? 'UINT8ARRAY' : 'TEXT'));
  s.update(b);
  return s.getHash('HEX');
};

bin.showBinInfo = function() {
  try {
    bin._showBinInfo();
  } catch(e) {
    bin.drawInfo('ERROR: ' + e);
  }
};
bin._showBinInfo = function() {
  var mode = bin.getMode();
  var s = $el('#src').value;
  if ((mode == 'bin') || (mode == 'hex')) {
    s = bin.extractBinTextPart(mode, s);
  }
  s = s.replace(/\s/g, '');
  var a;
  switch (mode) {
    case 'hex':
      a = bin.hex2uint8Array(s);
      break;
    case 'bin':
      a = bin.bin2uint8Array(s);
      break;
    default:
      a = bin.b642uint8Array(s);
  }
  bin.drawBinInfo(a);
};

bin.hex2uint8Array = function(s) {
  return bin.str2binArr(s, 2, '0x');
};

bin.bin2uint8Array = function(s) {
  return bin.str2binArr(s, 8, '0b');
};

bin.b642uint8Array = function(s) {
  return bin.decodeBase64(s);
};

bin.str2binArr = function(str, blkSize, pFix) {
  var a = [];
  for (var i = 0; i < str.length; i += blkSize) {
    var v = str.substr(i, blkSize);
    if (v.length == blkSize) {
      a.push(bin.parseInt(pFix + v));
    }
  }
  return a;
};

bin.parseInt = function(v) {
  var rdx = bin.checkRadix(v);
  if (rdx == 0) {
    return 0;
  } else if (rdx == 2) {
    v = v.substr(2);
  }
  return parseInt(v, rdx);
};

bin.checkRadix = function(v) {
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

bin.getHexDump = function(mode, buf) {
  var showSp = 1;
  var showAddr = 1;
  var showAscii = 1;
  var dmp = '';

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
    dmp += bin.dumpAddr(0);
  }

  for (var i = 0; i < len; i++) {
    dmp += bin.getDump(mode, i, buf, len, showSp, showAddr, showAscii);
  }
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
        dmp += bin.dumpAddr(st);
      }
      for (i = st; i < ed; i++) {
        dmp += bin.getDump(mode, i, buf, ed, showSp, showAddr, showAscii);
      }
    }
  }
  dmp += '\n';

  return dmp;
};

bin.getDump = function(mode, i, buf, len, showSp, showAddr, showAscii) {
  var b;
  if (mode == 'bin') {
    b = bin.dumpBin(i, buf);
  } else {
    b = bin.dumpHex(i, buf);
  }
  if ((i + 1) % 0x10 == 0) {
    if (showAscii) {
      b += '  ' + bin.dumpAscii(((i + 1) - 0x10), buf);
    }
    if ((i + 1) < len) {
      b += '\n';
      if (showAddr) b += bin.dumpAddr(i + 1);
    }
  } else if (showSp) {
    b += (((i + 1) % 8 == 0) ? '  ' : ' ');
  }
  return b;
},

bin.dumpAddr = function(i) {
  return ('0000000' + i.toString(16)).slice(-8).toUpperCase() + ' : ';
};
bin.dumpBin = function(i, buf) {
  return ((buf[i] == undefined) ? '        ' : bin.toBin(buf[i]));
};
bin.dumpDec = function(i, buf) {
  return ((buf[i] == undefined) ? '   ' : ('  ' + buf[i].toString()).slice(-3));
};
bin.dumpHex = function(i, buf) {
  return ((buf[i] == undefined) ? '  ' : ('0' + buf[i].toString(16)).slice(-2).toUpperCase());
};
bin.dumpAscii = function(pos, buf) {
  var b = '';
  var end = pos + 0x10;
  for (var i = pos; i < end; i++) {
    var code = buf[i];
    if (code == undefined) break;
    switch (code) {
      case 0x0A:
        b += bin.CHR_LF;
        break;
      case 0x0D:
        b += bin.CHR_CR;
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

bin.toBin = function(v) {
  return ('0000000' + v.toString(2)).slice(-8);
};

bin.formatB64 = function(d) {
  var a = d.split(',');
  var b64 = bin.inertNewline(a[1]);
  var r = a[0] + '\n' + b64;
  return r;
};

bin.inertNewline = function(s, n) {
  if (n == undefined) n = 76;
  var r = util.insertCh(s, '\n', n);
  return r;
};

bin.getFileType = function(b) {
  var filetypes = {
    bmp: {pattern: '42 4D', ext: 'bmp'},
    class: {pattern: 'CA FE BA BE', ext: 'class'},
    exe: {pattern: '4D 5A', ext: 'exe'},
    gif: {pattern: '47 49 46 38', ext: 'gif'},
    gz: {pattern: '1F 8B', ext: 'gz'},
    html: {pattern: '3C 21 44 4F 43 54 59 50 45 20 68 74 6D 6C', ext: 'html'},
    jpg: {pattern: 'FF D8', ext: 'jpg'},
    mp3: {pattern: '49 44 33', ext: 'mp3'},
    mp4: {pattern: 'xx xx xx xx 66 74 79 70', ext: 'mp4'},
    msg: {pattern: 'D0 CF 11 E0 A1 B1 1A E1', ext: 'msg'},
    pdf: {pattern: '25 50 44 46 2D', ext: 'pdf'},
    png: {pattern: '89 50 4E 47 0D 0A 1A 0A 00', ext: 'png'},
    txt_utf8_bom: {pattern: 'EF BB BF', ext: 'txt', info: 'UTF-8 BOM'},
    txt_utf16be_bom: {pattern: 'FE FF', ext: 'txt', info: 'UTF-16BE BOM'},
    txt_utf16le_bom: {pattern: 'FF FE', ext: 'txt', info: 'UTF-16LE BOM'},
    wav: {pattern: '52 49 46 46 B6 72 06 00 57 41 56 45 66 6D 74', ext: 'wav'},
    webp: {pattern: '52 49 46 46 xx xx xx xx 57 45 42 50', ext: 'webp'},
    xml: {pattern: '3C 3F 78 6D 6C 20', ext: 'xml'},
    zip: {pattern: '50 4B', ext: 'zip'}
  }
  var tp = {
    ext: 'txt',
    info: null
  };
  for (var k in filetypes) {
    ptn = filetypes[k]
    if (bin.matchHeader(ptn['pattern'], b)) {
      var ext = ptn['ext'];
      tp['ext'] = ext;
      if ('info' in ptn) {
        tp = bin.copyObjField(ptn, tp, 'info');
      } else {
        var binInfo = bin.getBinInfo(ext, b)
        if (binInfo) tp['info'] = binInfo;
      }
      break;
    }
  }
  return tp;
};

bin.copyObjField = function(src, dest, key) {
  if (key in src) dest[key] = src[key];
  return dest;
};

bin.matchHeader = function(ptn, a) {
  var head = ptn.split(' ');
  if (a.length < head.length) return false;
  for (var i = 0; i < head.length; i++) {
    var hex = head[i];
    if (hex == 'xx') continue;
    var v = +('0x' + hex);
    if (v != a[i]) return false;
  }
  return true;
};

bin.getBinInfo = function(type, b) {
  if (type == 'exe') {
    var pe = -1;
    var len = 512;
    for (var i = 0; i < len; i++) {
      if (i + 3 >= len) break;
      var ptn = bin.scanBin(b, i, 4);
      if (ptn == 0x50450000) {
        pe = i;break;
      }
    }
    var v = 0;
    if ((pe >= 0) && (pe + 5 < len)) {
      v = bin.scanBin(b, pe + 4, 2);
    }
    var r = '';
    var arch = '';
    if (v == 0x6486) {
      arch = 'x86-64 (64bit)';
    } else if (v == 0x4C01) {
      arch = 'x86 (32bit)';
    }
    if (arch) r += 'Arch: ' + arch;
    return r;
  } else if (type == 'class') {
    var v = b[7];
    var j;
    if (v <= 48) {
      j = '1.' + v - 44;
    } else {
      j = v - 44;
    }
    var r = '';
    if (j) r += 'Java version: Java SE ' + j + ' = ' + v + ' (' + bin.toHex(v, true, '0x', 2) + ')';
    return r;
  }
  return null;
};
bin.scanBin = function(b, p, ln) {
  var upto = 6;
  if ((p + (ln - 1) >= b.length) || (ln > upto)) return -1;
  var r = 0;
  for (var i = 0; i < ln; i++) {
    var d = b[p + i] * Math.pow(256, ln - (i + 1));
    r += d;
  }
  return r;
};

bin.toHex = function(v, uc, pFix, d) {
  var hex = parseInt(v).toString(16);
  return bin.formatHex(hex, uc, pFix, d);
};

bin.formatHex = function(hex, uc, pFix, d) {
  if (uc) hex = hex.toUpperCase();
  if ((d) && (hex.length < d)) {
    hex = (util.repeatCh('0', d) + hex).slice(d * (-1));
  }
  if (pFix) hex = pFix + hex;
  return hex;
};

bin.extractBinTextPart = function(mode, s) {
  var unit = (mode == 'bin' ? 8 : 2);
  var vStart = 11;
  var eEnd = unit * 16 + 16;
  s = s.trim();
  if (!s.startsWith('ADDRESS')) return s;
  var a = util.text2list(s);
  var b = '';
  for (var i = 2; i < a.length; i++) {
    var l = a[i];
    var w = l.substr(vStart, eEnd);
    b += w + '\n';
  }
  return b;
};

bin.onInput = function() {
  bin.showBinInfo();
  if (!bin.auto) return;
  bin.detectCurrentMode();
};

bin.detectCurrentMode = function() {
  var m = 'b64';
  var v = $el('#src').value;
  if (v.match(/^[01\s\n]+$/)) {
    m = 'bin';
  } else if (v.match(/^[0-9A-Fa-f\s\n]+$/)) {
    m = 'hex';
  }
  bin.activeMode(m);
};

bin.drawInfo = function(s) {
  $el('#info').innerHTML = s;
};

bin.confirmClear = function() {
  util.confirm('Clear?', bin.clear);
};

bin.clear = function() {
  bin.drawInfo('');
  $el('#src').value = '';
  $el('#src').focus();
};

bin.submit = function() {
  $el('#key-h').value = $el('#key').value;
  $el('#n-h').value = $el('#n').value;
  document.f1.submit();
};

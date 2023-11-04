var bin = {};
bin.auto = true;
$onReady = function() {
  util.textarea.addStatusInfo('#src', '#textareainfo');

  var opt = {
    mode: 'txt'
  };
  util.addDndHandler('#src', bin.onDnd, opt);

  bin.setMode('auto');
  bin.activeMode('b64');

  $el('#src').addEventListener('input', bin.onInput);
  $el('#src').addEventListener('change', bin.onInput);
  $el('#src').focus();
};

bin.setMode = function(mode, onlyMode) {
  if (mode != 'auto') {
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
};

bin.activeMode = function(mode) {
  bin.setMode(mode, true);
};

bin.onDnd = function(s) {
  $el('#src').value = s;
};

bin.onInput = function() {
  if (!bin.auto) return;
  var m = 'b64';
  var v = $el('#src').value;
  if (v.match(/^[01\s\n]+$/)) {
    m = 'bin';
  } else if (v.match(/^[0-9A-Fa-f\s\n]+$/)) {
    m = 'hex';
  }
  bin.activeMode(m);
};

bin.confirmClear = function() {
  util.confirm('Clear?', bin.clear);
};

bin.clear = function() {
  $el('#src').value = '';
  $el('#src').focus();
};

bin.submit = function() {
  $el('#key-h').value = $el('#key').value;
  $el('#n-h').value = $el('#n').value;
  document.f1.submit();
};

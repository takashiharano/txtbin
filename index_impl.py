#==============================================================================
# TxtBin - Screen Sender
# Copyright 2025 Takashi Harano
#==============================================================================
import os
import sys

ROOT_PATH = '../'

sys.path.append(os.path.join(os.path.dirname(__file__), ROOT_PATH + 'libs'))
import util
import appconfig

util.append_system_path(__file__, ROOT_PATH + '/websys')
try:
    import websys
except:
    pass

SCREEN_HTML_FILE = './txtbin.html'
PERMISSION_NAME = appconfig.PERMISSION_NAME

#------------------------------------------------------------------------------
def build_main_screen():
    html = util.read_text_file(SCREEN_HTML_FILE)
    return html

#------------------------------------------------------------------------------
def build_forbidden_screen():
    html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="robots" content="none">
<meta name="referrer" content="no-referrer">
<meta name="referrer" content="never">
<title>txtbin</title>
<link rel="stylesheet" href="style.css" />
</head>
<body>
FORBIDDEN
</body>
</html>'''
    return html

#------------------------------------------------------------------------------
def build_auth_redirection_screen():
    html = '''<!DOCTYPE html>
<html>
<head>
<meta charset="utf-8">
<meta name="robots" content="none">
<meta name="referrer" content="no-referrer">
<meta name="referrer" content="never">
'''
    html += '<script src="' + ROOT_PATH + 'libs/debug.js"></script>'
    html += '<script src="' + ROOT_PATH + 'libs/util.js"></script>'
    html += '<script src="' + ROOT_PATH + 'websys/websys.js"></script>'
    html += '<script src="./?res=js"></script>'
    html += '''
<script>
$onLoad = function() {
  websys.authRedirection(location.href);
};
</script>
</head>
<body></body>
</html>'''
    return html

#------------------------------------------------------------------------------
def send_js():
    js = 'websys.init(\'' + ROOT_PATH + '/\');'
    util.send_response(js, 'text/javascript')

#------------------------------------------------------------------------------
def main():
    if 'websys' in sys.modules:
        context = websys.on_access()

    res = util.get_request_param('res')
    if res == 'js':
        send_js()
        return

    if appconfig.NEED_AUTH:
        if 'websys' in sys.modules:
            if context.is_authorized():
                if PERMISSION_NAME == '' or context.has_permission(PERMISSION_NAME):
                    html = build_main_screen()
                else:
                    html = build_forbidden_screen()
            else:
                html = build_auth_redirection_screen()
        else:
            html = 'websys module is required';
    else:
        html = build_main_screen()

    util.send_html(html)

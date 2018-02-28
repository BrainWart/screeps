import json
import urllib.request
import getopt
import sys
import glob
import io
import os

def usage():
    print("""upload files
  --config
  --branch
  --path""")

def main():
    try:
        opts, args = getopt.getopt(sys.argv[1:], "hc:b:p:", ["help", "config=", "branch=", "path="])
    except getopt.GetoptError as err:
        print(err)
        usage()
        sys.exit(2)

    config = "config.json"
    branch = None
    path = None
    for o, a in opts:
        if o in ("-h", "--help"):
            usage()
            sys.exit()
        elif o in ("-c", "--config"):
            config = a
        elif o in ("-b", "--branch"):
            branch = a
        elif x in ("-p", "--path"):
            path = a

    config = json.load(io.open(config))

    token = config["token"]
    url = config["url"]
    globs = config["globs"]
    branch = branch or config["branch"] or "default"
    

    if len(args) == 0:
        path = path or config["path"] or ""
        if os.path.isdir(path):
            os.chdir(path)
        
        for g in globs:
            args += glob.glob(g)

    dataObj = {"branch": branch, "modules": {}}

    for arg in args:
        try:
            contents = io.open(arg).read()
            dataObj["modules"][arg.replace("/", "_").replace("\\", "_").replace(".js", "")] = contents
        except io.IOError as err:
            print("couldn't open file:: " + arg)
    
    data = json.dumps(dataObj, separators=(',', ':')).encode("utf-8")
    r = urllib.request.Request(url , data, {"X-Token": token, 'Content-Type': 'application/json; charset=utf-8'})
    response = urllib.request.urlopen(r)
    print(response.read())

if __name__ == '__main__':
    main()

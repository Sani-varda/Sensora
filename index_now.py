import json
import xml.etree.ElementTree as ET
import os
import urllib.request
import urllib.error

def get_urls_from_sitemap(sitemap_path):
    """
    Parses sitemap.xml to extract all URLs.
    """
    if not os.path.exists(sitemap_path):
        print(f"Sitemap file not found at: {sitemap_path}")
        return []
        
    try:
        tree = ET.parse(sitemap_path)
        root = tree.getroot()
        namespace = {'ns': 'http://www.sitemaps.org/schemas/sitemap/0.9'}
        urls = []
        for url in root.findall('ns:url', namespace):
            loc = url.find('ns:loc', namespace)
            if loc is not None and loc.text:
                urls.append(loc.text.strip())
        return urls
    except Exception as e:
        print(f"Error parsing sitemap: {e}")
        return []

def submit_to_index_now(url_list, host, key, key_location=None):
    """
    Submits a list of URLs to the IndexNow API (Bing/Yandex).
    Uses standard library urllib for zero-dependency execution.
    """
    endpoint = "https://api.indexnow.org/IndexNow"
    
    payload = {
        "host": host,
        "key": key,
        "keyLocation": key_location if key_location else f"https://{host}/{key}.txt",
        "urlList": url_list
    }
    
    data = json.dumps(payload).encode('utf-8')
    req = urllib.request.Request(
        endpoint,
        data=data,
        headers={
            "Content-Type": "application/json; charset=utf-8",
            "User-Agent": "Sensora-IndexNow-Client/1.0"
        },
        method="POST"
    )
    
    try:
        with urllib.request.urlopen(req, timeout=15) as response:
            status_code = response.status
            if status_code in [200, 202]:
                status_msg = "Successfully submitted" if status_code == 200 else "Submitted successfully (HTTP 202 - verification in progress)"
                print(f"{status_msg} {len(url_list)} URLs to IndexNow (Bing & Yandex).")
                for url in url_list:
                    print(f"  - {url}")
            else:
                print(f"Received status code: {status_code}")
    except urllib.error.HTTPError as e:
        print(f"IndexNow HTTP Error: {e.code} - {e.reason}")
        try:
            print(e.read().decode('utf-8'))
        except Exception:
            pass
    except Exception as e:
        print(f"IndexNow connection error: {e}")

if __name__ == "__main__":
    MY_HOST = "sensora.co.in"
    MY_KEY = "5b76e54cf5884465a14d1fb9c32d481d"
    
    sitemap_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sitemap.xml")
    
    print("Extracting URLs from sitemap.xml...")
    URLS = get_urls_from_sitemap(sitemap_file)
    
    if URLS:
        print(f"Found {len(URLS)} URLs to index. Submitting to IndexNow...")
        submit_to_index_now(URLS, MY_HOST, MY_KEY)
    else:
        print("No URLs found to submit.")

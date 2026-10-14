import requests
import json
import xml.etree.ElementTree as ET
import os

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
        # Sitemap XML uses namespace http://www.sitemaps.org/schemas/sitemap/0.9
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
    """
    endpoint = "https://api.indexnow.org/IndexNow"
    
    payload = {
        "host": host,
        "key": key,
        "keyLocation": key_location if key_location else f"https://{host}/{key}.txt",
        "urlList": url_list
    }
    
    headers = {
        "Content-Type": "application/json; charset=utf-8"
    }
    
    try:
        response = requests.post(endpoint, data=json.dumps(payload), headers=headers)
        if response.status_code in [200, 202]:
            status_msg = "Successfully submitted" if response.status_code == 200 else "Submitted successfully (verification pending)"
            print(f"{status_msg} {len(url_list)} URLs to IndexNow.")
            for url in url_list:
                print(f"  - {url}")
        else:
            print(f"Failed to submit to IndexNow. Status code: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    MY_HOST = "sensora.in"
    MY_KEY = "5b76e54cf5884465a14d1fb9c32d481d"
    
    # Path to sitemap.xml in current directory
    sitemap_file = os.path.join(os.path.dirname(os.path.abspath(__file__)), "sitemap.xml")
    
    print("Extracting URLs from sitemap.xml...")
    URLS = get_urls_from_sitemap(sitemap_file)
    
    if URLS:
        print(f"Found {len(URLS)} URLs to index. Submitting to IndexNow...")
        submit_to_index_now(URLS, MY_HOST, MY_KEY)
    else:
        print("No URLs found to submit.")

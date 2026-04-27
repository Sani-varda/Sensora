import requests
import json

def submit_to_index_now(url_list, host, key, key_location=None):
    """
    Submits a list of URLs to the IndexNow API (Bing/Yandex).
    
    :param url_list: List of URLs to index
    :param host: Your website domain (e.g., mlarc.ai)
    :param key: Your IndexNow API key
    :param key_location: Optional URL to your key file (e.g., https://mlarc.ai/indexnow_key.txt)
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
        if response.status_code == 200:
            print(f"Successfully submitted {len(url_list)} URLs to IndexNow.")
        else:
            print(f"Failed to submit to IndexNow. Status code: {response.status_code}")
            print(response.text)
    except Exception as e:
        print(f"An error occurred: {e}")

if __name__ == "__main__":
    # Example usage
    # You would need to generate a key and place it on your server first.
    # See indexnow.org for more details.
    MY_HOST = "mlarc.ai"
    MY_KEY = "YOUR_INDEXNOW_KEY_HERE" # Placeholder
    URLS = [
        "https://mlarc.ai/index.html",
        "https://mlarc.ai/solutions/ai-for-real-estate.html",
        "https://mlarc.ai/solutions/ai-for-ecommerce.html"
    ]
    
    print("IndexNow submission script ready. Please update with your actual API key.")
    # submit_to_index_now(URLS, MY_HOST, MY_KEY)

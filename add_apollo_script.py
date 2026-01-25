import os

script_to_add = """  <script>function initApollo(){var n=Math.random().toString(36).substring(7),o=document.createElement("script");
  o.src="https://assets.apollo.io/micro/website-tracker/tracker.iife.js?nocache="+n,o.async=!0,o.defer=!0,
  o.onload=function(){window.trackingFunctions.onLoad({appId:"69470d8cfab3780011720978"})},
  document.head.appendChild(o)}initApollo();</script>
"""

directory = r"c:\Users\imsun\.gemini\antigravity\scratch\AI Website\arino-creative-agency-template-2024-03-30-07-32-10-utc\Arino - Template"

updated_files = []
for filename in os.listdir(directory):
    if filename.endswith(".html"):
        filepath = os.path.join(directory, filename)
        try:
            with open(filepath, "r", encoding="utf-8") as f:
                content = f.read()
            
            if "</head>" in content and "initApollo" not in content:
                new_content = content.replace("</head>", script_to_add + "</head>")
                with open(filepath, "w", encoding="utf-8") as f:
                    f.write(new_content)
                updated_files.append(filename)
        except Exception as e:
            print(f"Error processing {filename}: {e}")

print(f"Updated {len(updated_files)} files: {', '.join(updated_files)}")

import os

TAWK_SCRIPT = """<!--Start of Tawk.to Script-->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/69763534944bf7197b43238a/1jfqrvlro';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!--End of Tawk.to Script-->"""

def add_script_to_html():
    files_modified = 0
    files_skipped = 0
    
    print("Starting Tawk.to script injection...")
    
    # List all files in current directory
    files = [f for f in os.listdir('.') if os.path.isfile(f)]
    
    for filename in files:
        if filename.endswith(".html"):
            try:
                with open(filename, 'r', encoding='utf-8') as f:
                    content = f.read()
                
                if "Tawk_API" in content:
                    print(f"Skipping {filename} - Script already present")
                    files_skipped += 1
                    continue
                
                # Check for closing body tag (case insensitive)
                if "</body>" in content.lower():
                    # Replace the last occurrence of </body>
                    # We use rsplit to ensure we find the last body tag if there are nested ones (unlikely in valid HTML but good practice)
                    # Actually valid HTML only has one body. Simple replace is fine, but let's be safe and insert before the last </body>
                    
                    # Split by the lower case version to find the index, but operate on original content
                    idx = content.lower().rfind("</body>")
                    if idx != -1:
                        new_content = content[:idx] + f"{TAWK_SCRIPT}\n" + content[idx:]
                        with open(filename, 'w', encoding='utf-8') as f:
                            f.write(new_content)
                        print(f"Modified {filename}")
                        files_modified += 1
                    else:
                         print(f"Warning: Could not find position to insert in {filename}")
                else:
                    print(f"Warning: No </body> tag found in {filename}")
            except Exception as e:
                print(f"Error processing {filename}: {e}")

    print(f"\nSummary: Modified {files_modified} files, Skipped {files_skipped} files.")

if __name__ == "__main__":
    add_script_to_html()

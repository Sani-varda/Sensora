import os

industries = [
    {
        "slug": "ai-for-real-estate",
        "industry": "Real Estate",
        "title": "AI Solutions for Real Estate Agencies",
        "meta_description": "Transform your real estate business with custom AI agents for lead qualification, automated property matching, and 24/7 client support.",
        "keywords": "AI for Real Estate, Real Estate Automation, Property AI, ML Arc",
        "content": "<p>In the fast-paced world of real estate, speed to lead is everything. ML Arc's AI agents ensure that every inquiry is met with an immediate, intelligent response. Our systems can qualify buyers, schedule viewings, and follow up with cold leads automatically.</p><p>By integrating AI into your CRM, your agents can focus on closing deals while the AI handles the administrative heavy lifting.</p>"
    },
    {
        "slug": "ai-for-ecommerce",
        "industry": "E-commerce",
        "title": "AI Automation for E-commerce Brands",
        "meta_description": "Boost your e-commerce sales with AI-powered customer support, personalized product recommendations, and automated order tracking.",
        "keywords": "AI for Ecommerce, Ecommerce Automation, Shopify AI, ML Arc",
        "content": "<p>E-commerce success depends on customer experience and operational efficiency. Our AI agents provide instant support across WhatsApp, Instagram, and your website, reducing cart abandonment and increasing average order value.</p><p>From handling FAQs about shipping to providing personalized style advice, our AI solutions are like having a 24/7 sales team.</p>"
    },
    {
        "slug": "ai-for-healthcare",
        "industry": "Healthcare",
        "title": "Intelligent AI for Healthcare Providers",
        "meta_description": "Enhance patient engagement with AI appointment scheduling, automated follow-ups, and secure patient communication systems.",
        "keywords": "AI for Healthcare, Medical Automation, Patient Support AI, ML Arc",
        "content": "<p>Healthcare providers often struggle with administrative burdens. ML Arc provides HIPAA-compliant AI solutions that streamline appointment booking, patient intake, and post-consultation follow-ups.</p><p>Our AI agents can handle thousands of routine inquiries simultaneously, ensuring that your staff can prioritize urgent patient care.</p>"
    },
    {
        "slug": "ai-for-law-firms",
        "industry": "Law Firms",
        "title": "AI Document & Client Management for Law Firms",
        "meta_description": "Streamline legal workflows with AI-driven intake forms, automated document review, and intelligent client communication.",
        "keywords": "AI for Lawyers, Legal Automation, Law Firm AI, ML Arc",
        "content": "<p>Law firms spend countless hours on discovery and client intake. Our AI agents automate the initial screening of leads, gathering essential case information before a human attorney even picks up the phone.</p><p>With intelligent document processing, we help firms summarize case files and extract key data points in seconds.</p>"
    },
    {
        "slug": "ai-for-saas",
        "industry": "SaaS Companies",
        "title": "Scale Your SaaS with AI-Powered Support & Growth",
        "meta_description": "Reduce churn and scale support with AI agents that handle technical queries, user onboarding, and feature education.",
        "keywords": "AI for SaaS, SaaS Automation, Product Support AI, ML Arc",
        "content": "<p>SaaS companies need to provide instant support to prevent churn. ML Arc's AI agents are trained on your product documentation to provide precise technical answers and guide users through onboarding flows.</p><p>By automating tier-1 support, your engineering team can focus on building features while your users get the help they need instantly.</p>"
    }
]

def generate_pages():
    template_path = "solution-template.html"
    output_dir = "solutions"
    
    if not os.path.exists(output_dir):
        os.makedirs(output_dir)
        
    with open(template_path, "r", encoding="utf-8") as f:
        template = f.read()
        
    for data in industries:
        content = template
        for key, value in data.items():
            placeholder = f"{{{{{key.upper()}}}}}"
            content = content.replace(placeholder, value)
            
        file_path = os.path.join(output_dir, f"{data['slug']}.html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Generated: {file_path}")

def update_sitemap():
    sitemap_path = "sitemap.xml"
    with open(sitemap_path, "r", encoding="utf-8") as f:
        lines = f.readlines()
        
    # Find the last </urlset>
    new_urls = []
    base_url = "https://mlarc.ai/solutions/" # Assuming this is the domain
    
    for data in industries:
        url_entry = f"  <url>\n    <loc>{base_url}{data['slug']}.html</loc>\n    <priority>0.80</priority>\n  </url>\n"
        new_urls.append(url_entry)
        
    # Insert before the last line
    lines.insert(-1, "".join(new_urls))
    
    with open(sitemap_path, "w", encoding="utf-8") as f:
        f.writelines(lines)
    print("Sitemap updated.")

if __name__ == "__main__":
    generate_pages()
    update_sitemap()

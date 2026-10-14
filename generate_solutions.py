import os

industries = [
    {
        "slug": "patient360-healthcare-marketing",
        "industry": "Healthcare & Hospitals",
        "title": "Healthcare Marketing & Patient Acquisition Engine | Sensora",
        "meta_description": "Scale your clinic or hospital with Patient360™: patient discovery, high-intent Google & Meta campaigns, doctor reputation, and WhatsApp CRM booking.",
        "keywords": "Healthcare Marketing, Patient Acquisition, Hospital Digital Marketing, Doctor Personal Branding, Medical Clinic Growth, Sensora",
        "content": "<p>Patient discovery and healthcare decisions have moved entirely digital. Sensora's Patient360™ connects patient discovery, clinical authority content, targeted acquisition, conversion landing pages, and WhatsApp CRM follow-ups into one ethical, high-converting patient growth engine.</p><p>From multi-specialty hospitals to specialized clinics and surgical centres of excellence, we build predictable patient pipelines that improve enquiry-to-consultation ratios while establishing lasting institutional trust.</p>"
    },
    {
        "slug": "market360-business-growth",
        "industry": "Enterprise & SMEs",
        "title": "Market360™ Integrated Brand Marketing & Revenue Engine | Sensora",
        "meta_description": "Transform your business with Market360™: end-to-end digital marketing, corporate brand positioning, precision paid media, SEO, and sales pipeline coordination.",
        "keywords": "Integrated Marketing Agency, B2B Growth Engine, Corporate Brand Transformation, Performance Marketing, Revenue Growth, Sensora",
        "content": "<p>Market360™ is an end-to-end growth system that integrates brand positioning, creative content production, high-intent SEO, paid search/social campaigns, and automated sales nurture flows.</p><p>We eliminate fragmented agency silos. Our unified team handles everything from market analysis and creative storytelling to conversion optimization, turning commercial attention into measurable, recurring revenue.</p>"
    },
    {
        "slug": "b2b-demand-engine",
        "industry": "B2B & SaaS Companies",
        "title": "B2B Demand Engine™ | High-Value Pipeline & Lead Generation | Sensora",
        "meta_description": "Accelerate high-ticket B2B sales cycles with precision account targeting, LinkedIn outreach, executive thought leadership, and automated CRM nurture funnels.",
        "keywords": "B2B Lead Generation, Account Based Marketing, B2B Demand Generation, LinkedIn Marketing, Sales Pipeline Automation, Sensora",
        "content": "<p>Designed for businesses with high-value contracts and complex sales cycles. The B2B Demand Engine™ identifies ideal customer profiles (ICPs), deploys multi-channel account-based campaigns, and nurtures decision-makers across LinkedIn, email, and Google search.</p><p>We align your marketing with sales enablement, delivering pre-qualified, sales-ready prospects directly to your pipeline with full attribution and transparent ROI metrics.</p>"
    },
    {
        "slug": "admission360-education-marketing",
        "industry": "Schools & Education Institutes",
        "title": "Admission360™ | Student Enrolment & School Brand Strategy | Sensora",
        "meta_description": "Drive consistent school admissions and parent trust with Admission360™: school branding, digital acquisition, tour booking funnels, and automated parent communication.",
        "keywords": "Education Marketing, School Admissions Growth, Education Branding, Student Recruitment, Parent Experience Journey, Sensora",
        "content": "<p>Marketing for educational institutions isn't just social media—it's institutional trust, parent confidence, and confirmed enrolments. Admission360™ connects school reputation, targeted Meta and Google campaigns, open-day landing pages, and automated WhatsApp parent journeys.</p><p>We help K-12 schools, international academies, and higher education groups maximize tour attendance, application rates, and student enrolment predictability.</p>"
    },
    {
        "slug": "startup-launch360-growth",
        "industry": "Startups & Emerging Founders",
        "title": "Startup Launch360™ & Fractional Marketing Department | Sensora",
        "meta_description": "Launch and scale your startup with Launch360™ and Fractional Marketing: brand kits, go-to-market execution, PR outreach, and repeatable CAC-optimized acquisition funnels.",
        "keywords": "Startup Marketing Agency, Go To Market Strategy, Startup Brand Kit, Fractional CMO, Customer Acquisition Funnel, Sensora",
        "content": "<p>Built specifically for founders transitioning from product development to market traction. We deliver the strategic brand foundation, high-converting web presence, PR narrative, and initial paid acquisition campaigns needed for a breakout launch.</p><p>Beyond launch, our Fractional Marketing Department acts as your external growth team—delivering senior marketing leadership, creative direction, and CAC-lowering growth loops without full-time executive overhead.</p>"
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
            placeholder = "{{" + key.upper() + "}}"
            content = content.replace(placeholder, value)
            
        file_path = os.path.join(output_dir, f"{data['slug']}.html")
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(content)
        print(f"Generated: {file_path}")

if __name__ == "__main__":
    generate_pages()

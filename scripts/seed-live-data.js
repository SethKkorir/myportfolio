const mongoose = require('mongoose');
require('dotenv').config();

const { connectToMongoDB } = require('../models/db');
const PortfolioContent = require('../models/portfolio-content');
const Project = require('../models/project');
const Skill = require('../models/skill');
const Resume = require('../models/resume');

const seedData = async () => {
    try {
        console.log("Connecting to MongoDB Atlas...");
        await mongoose.connect(process.env.MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });
        console.log("Connected successfully!");

        // 1. Seed PortfolioContent
        console.log("Clearing PortfolioContent collection...");
        await PortfolioContent.deleteMany({});
        console.log("Seeding real PortfolioContent...");
        await PortfolioContent.create({
            hero: {
                greeting: "Hello, I'm",
                name: "Seth Kipchumba Korir",
                tagline: "Applied Computer Science Student at Daystar University & Junior Web Developer with hands-on experience in the MERN stack and REST API development.",
                profilePhoto: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&q=80&w=800"
            },
            about: {
                text: "A highly motivated Applied Computer Science student at Daystar University, skilled in the MERN stack, APIs and version control. Passionate about building accessible, user-friendly technology.",
                subText: "My technical journey is driven by solving complex problems with clean and modular code. Working with modern architectures allows me to bridge the gap between robust backend operations and highly interactive user experiences."
            },
            blogPosts: [
                {
                    title: 'The Sauna Life',
                    excerpt: 'Exploring the profound health benefits and cultural significance of sauna practices around the globe.',
                    date: 'Oct 24, 2024',
                    readTime: '8 min read',
                    category: 'Lifestyle',
                    href: 'https://medium.com/@kipzseth/the-sauna-life-0c400f8bb4b4',
                    image: 'https://images.unsplash.com/photo-1544161515-4af6b1d46409?auto=format&fit=crop&q=80&w=800',
                },
                {
                    title: 'Cultural Evolution in Kenya',
                    excerpt: 'An insightful comparative study of diverse cultural traditions across Kenyan communities and their modern evolution.',
                    date: 'Sep 15, 2024',
                    readTime: '12 min read',
                    category: 'Culture',
                    href: 'https://medium.com/@kipzseth/comparison-between-different-cultures-in-kenya-d88a13e6e42a',
                    image: 'https://images.unsplash.com/photo-1523805081326-ff966a9df95d?auto=format&fit=crop&q=80&w=800',
                }
            ],
            testimonials: [
                {
                    name: "Dr. Zipporah Mwololo",
                    role: "HOD, Computer Science - Daystar University",
                    text: "Seth exhibits remarkable dedication, deep logical reasoning, and a passion for engineering high-performance web systems."
                }
            ],
            contact: {
                phone: "+254748497623",
                email: "zsethkipchumba179@gmail.com",
                location: "Bomet, Nairobi, 20400"
            },
            socials: [
                { id: 1, platform: "GitHub", href: "https://github.com/SethKkorir", icon: "Github" },
                { id: 2, platform: "LinkedIn", href: "https://www.linkedin.com/in/seth-korir-7b9416279/", icon: "Linkedin" },
                { id: 3, platform: "Twitter", href: "https://x.com/Kipchumba_sk", icon: "Twitter" }
            ]
        });

        // 2. Seed Projects
        console.log("Clearing Project collection...");
        await Project.deleteMany({});
        console.log("Seeding real Project entry...");
        await Project.create({
            title: "Rerendet Coffee",
            description: "A premium digital coffee brand experience engineered for modern responsive commerce. Features seamless state management, rich smooth animations, and a polished dark interface.",
            techStack: ["React.js", "Vanilla CSS", "Framer Motion"],
            image: "https://images.unsplash.com/photo-1517694712202-14dd9538aa97?auto=format&fit=crop&q=80&w=800",
            githubLink: "https://github.com/SethKkorir/rerendet_website",
            demoLink: "https://rerendet-website-two.vercel.app/"
        });

        // 3. Seed Skills
        console.log("Clearing Skill collection...");
        await Skill.deleteMany({});
        console.log("Seeding real Skill items...");
        const skillsList = [
            { name: 'HTML / CSS', level: 95, category: 'Frontend', icon: 'Code2' },
            { name: 'JavaScript (ES6+)', level: 50, category: 'Frontend', icon: 'Code2' },
            { name: 'React.js', level: 40, category: 'Frontend', icon: 'Code2' },
            { name: 'Node.js / Express', level: 80, category: 'Backend', icon: 'Server' },
            { name: 'REST API Design', level: 85, category: 'Backend', icon: 'Server' },
            { name: 'MongoDB', level: 75, category: 'Database', icon: 'Database' },
            { name: 'Git & GitHub', level: 90, category: 'Tools', icon: 'Layers' },
            { name: 'Postman', level: 85, category: 'Tools', icon: 'Layers' },
            { name: 'npm', level: 80, category: 'Tools', icon: 'Layers' },
        ];
        await Skill.insertMany(skillsList);

        // 4. Seed Resume
        console.log("Clearing Resume collection...");
        await Resume.deleteMany({});
        console.log("Seeding real Resume document...");
        await Resume.create({
            name: "Seth Kipchumba Korir",
            title: "Junior Web Developer & Applied Computer Science Student",
            summary: "A highly motivated and detail-oriented student pursuing a Bachelor’s degree in Applied Computer Science at Daystar University. Skilled in web development with a strong foundation in the MERN stack (MongoDB, Express, Node.js), APIs, and version control using Git. Passionate about creating accessible and user-friendly technologies, I am eager to contribute to innovative projects, collaborate with diverse teams, and further develop my technical expertise.",
            contact: {
                email: "zsethkipchumba179@gmail.com",
                phone: "+254748497623",
                location: "Bomet, Nairobi, 20400",
                github: "github.com/SethKkorir",
                linkedin: "linkedin.com/in/Seth-Kipchumba-Korir"
            },
            experience: [
                {
                    role: "Attachment Trainee",
                    org: "Techsavanna Company Limited (Software solutions)",
                    time: "2024",
                    points: [
                        "Gained hands-on experience in developing REST APIs and integrating them into web applications.",
                        "Collaborated with a team of developers to design, develop, and test backend systems.",
                        "Enhanced skills in team collaboration, version control (Git), and API documentation using tools like Postman.",
                        "Contributed to the development of scalable and efficient backend solutions."
                    ]
                }
            ],
            education: [
                { degree: "Bachelor of Applied Computer Science", school: "Daystar University", time: "2024 – Present" },
                { degree: "Diploma in ICT", school: "Daystar University", time: "2023 – 2024" },
                { degree: "Certificate in ICT", school: "Daystar University", time: "May- 2022 to Nov-2022" },
                { degree: "Kenya Certificate of Secondary Education (KCSE)", school: "Koibeiyon Secondary School", time: "2018 – 2021" }
            ],
            skills: {
                frontend: ["HTML", "CSS", "JavaScript", "React"],
                backend: ["Node.js", "Express", "MongoDB", "REST APIs"],
                tools: ["Git", "Postman", "VS Code", "Poster Design"]
            },
            projects: [
                {
                    name: "Rerendet Coffee – Digital Brand Platform",
                    tech: "HTML | CSS | JavaScript | React.js (Learning) | MERN (In Progress)",
                    desc: "Designed and developed a modern coffee brand website to simulate a real-world business digital presence. Built the initial version using HTML, CSS, and JavaScript, then began transitioning to React.js for component-based development. Currently learning and applying React.js concepts including components, props, and state management. Developing backend functionality using Node.js and Express as part of a MERN stack architecture. Focused on responsive design, performance, and clean UI/UX.",
                    link: "https://rerendet-website-two.vercel.app/"
                }
            ],
            referees: [
                {
                    name: "Dr. Zipporah Mwololo",
                    role: "HOD, Computer Science",
                    org: "Daystar University",
                    contact: "Phone: +254716372466 | Email: zmwololo@daystar.ac.ke"
                }
            ]
        });

        console.log("Database seeded successfully with all real frontend information!");
        mongoose.connection.close();
        process.exit(0);
    } catch (err) {
        console.error("Error seeding database:", err);
        process.exit(1);
    }
};

seedData();

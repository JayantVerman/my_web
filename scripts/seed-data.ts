import { db } from "../server/db";
import { projects, testimonials } from "../shared/schema";

async function seedData() {
  try {
    // Sample projects
    const sampleProjects = [
      {
        title: "Real-time Data Pipeline on AWS",
        description: "Built a scalable real-time data pipeline using AWS Kinesis, Lambda, and Redshift to process millions of events per day.",
        longDescription: "This project involved designing and implementing a comprehensive real-time data pipeline architecture on AWS. The solution processes over 10 million events daily from multiple sources including web applications, mobile apps, and IoT devices.\n\nKey components include:\n- AWS Kinesis Data Streams for real-time event ingestion\n- AWS Lambda functions for data transformation and routing\n- Amazon Redshift for data warehousing\n- AWS Glue for ETL operations\n- CloudWatch for monitoring and alerting\n\nThe pipeline achieves 99.9% uptime and processes data with sub-second latency, enabling real-time analytics and decision-making for business stakeholders.",
        imageUrl: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        technologies: ["AWS", "Python", "Kinesis", "Lambda", "Redshift", "Glue"],
        githubUrl: "https://github.com/jayant/aws-data-pipeline",
        liveUrl: "https://aws-pipeline-demo.example.com",
        category: "regular",
        featured: true,
      },
      {
        title: "ML Model Deployment with MLflow",
        description: "Deployed machine learning models to production using MLflow, Docker, and Kubernetes for automated model versioning and monitoring.",
        longDescription: "Developed a complete MLOps pipeline for deploying machine learning models to production. The solution includes automated model training, versioning, deployment, and monitoring capabilities.\n\nTechnologies used:\n- MLflow for experiment tracking and model registry\n- Docker for containerization\n- Kubernetes for orchestration\n- Apache Airflow for workflow automation\n- Prometheus and Grafana for monitoring\n\nThe pipeline supports A/B testing, automated rollbacks, and continuous integration/deployment for ML models.",
        imageUrl: "https://images.unsplash.com/photo-1555949963-aa79dcee981c?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        technologies: ["Python", "MLflow", "Docker", "Kubernetes", "Airflow"],
        githubUrl: "https://github.com/jayant/mlops-pipeline",
        category: "regular",
        featured: true,
      },
      {
        title: "Snowflake Data Warehouse Migration",
        description: "Migrated legacy data warehouse to Snowflake, improving query performance by 300% and reducing costs by 40%.",
        longDescription: "Led the migration of a legacy on-premise data warehouse to Snowflake cloud platform. The project involved:\n\n- Assessment of existing data architecture\n- Design of new cloud-native data model\n- Migration of 500+ tables and 10TB of historical data\n- Implementation of automated data pipelines\n- Performance optimization and cost management\n\nResults:\n- 300% improvement in query performance\n- 40% reduction in infrastructure costs\n- 99.9% data availability\n- Automated scaling based on workload demands",
        imageUrl: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        technologies: ["Snowflake", "SQL", "Python", "DBT", "Airflow"],
        githubUrl: "https://github.com/jayant/snowflake-migration",
        category: "regular",
        featured: true,
      },
      {
        title: "E-commerce Analytics Platform",
        description: "Built a comprehensive analytics platform for e-commerce client using PySpark, Kafka, and MongoDB for real-time insights.",
        longDescription: "Developed a full-stack analytics platform for a major e-commerce client to provide real-time insights into customer behavior, sales performance, and inventory management.\n\nArchitecture:\n- Apache Kafka for event streaming\n- PySpark for large-scale data processing\n- MongoDB for flexible data storage\n- React dashboard for visualization\n- AWS EC2 for infrastructure\n\nKey features:\n- Real-time customer behavior tracking\n- Sales performance analytics\n- Inventory optimization\n- Predictive analytics for demand forecasting\n- Custom reporting and alerting",
        imageUrl: "https://images.unsplash.com/photo-1563013544-824ae1b704d3?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        technologies: ["PySpark", "Kafka", "MongoDB", "React", "AWS"],
        githubUrl: "https://github.com/jayant/ecommerce-analytics",
        liveUrl: "https://analytics-demo.example.com",
        category: "freelance",
        featured: false,
      },
      {
        title: "Healthcare Data Integration",
        description: "Integrated disparate healthcare data sources using Apache Airflow and PostgreSQL for a medical research organization.",
        longDescription: "Designed and implemented a comprehensive data integration solution for a healthcare research organization dealing with multiple data sources including EMR systems, lab results, and patient surveys.\n\nChallenges addressed:\n- HIPAA compliance requirements\n- Data quality and standardization\n- Real-time and batch processing needs\n- Scalability for growing data volumes\n\nSolution components:\n- Apache Airflow for workflow orchestration\n- PostgreSQL for centralized data storage\n- Python for data transformation\n- Tableau for reporting and visualization\n- Automated data quality checks and validation",
        imageUrl: "https://images.unsplash.com/photo-1576091160399-112ba8d25d1f?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=1000&q=80",
        technologies: ["Apache Airflow", "PostgreSQL", "Python", "Tableau"],
        category: "freelance",
        featured: false,
      },
    ];

    // Sample testimonials
    const sampleTestimonials = [
      {
        name: "Sarah Johnson",
        title: "CTO",
        company: "TechCorp Solutions",
        content: "Jayant delivered an exceptional data pipeline solution that transformed our analytics capabilities. The real-time processing system he built handles millions of events daily with remarkable reliability.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1494790108755-2616b612b786?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150",
        isActive: true,
      },
      {
        name: "Michael Chen",
        title: "Data Director",
        company: "Analytics Pro",
        content: "Working with Jayant on our Snowflake migration was a game-changer. He not only delivered on time but also exceeded our performance expectations while staying within budget.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150",
        isActive: true,
      },
      {
        name: "Emily Rodriguez",
        title: "VP of Operations",
        company: "E-commerce Plus",
        content: "The analytics platform Jayant built for us provides invaluable insights into our customer behavior. The real-time dashboard has become an essential tool for our business decisions.",
        rating: 5,
        avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=150&h=150",
        isActive: true,
      },
    ];

    // Check if data already exists
    const existingProjects = await db.select().from(projects);
    const existingTestimonials = await db.select().from(testimonials);

    if (existingProjects.length === 0) {
      await db.insert(projects).values(sampleProjects);
      console.log("Sample projects inserted successfully");
    } else {
      console.log("Projects already exist, skipping insertion");
    }

    if (existingTestimonials.length === 0) {
      await db.insert(testimonials).values(sampleTestimonials);
      console.log("Sample testimonials inserted successfully");
    } else {
      console.log("Testimonials already exist, skipping insertion");
    }

    console.log("Database seeded successfully!");
  } catch (error) {
    console.error("Error seeding database:", error);
  }
  
  process.exit(0);
}

seedData();
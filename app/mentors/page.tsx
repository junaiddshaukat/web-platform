import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Github, Linkedin, Twitter, ArrowRight } from "lucide-react"

const mentors = [
  {
    name: "Sarah Johnson",
    role: "Senior Frontend Developer",
    skills: ["React", "Next.js", "TypeScript"],
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Michael Chen",
    role: "DevOps Engineer",
    skills: ["CI/CD", "Docker", "Kubernetes"],
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Dr. Priya Patel",
    role: "AI Researcher",
    skills: ["Machine Learning", "NLP", "Python"],
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    name: "James Wilson",
    role: "Cloud Architect",
    skills: ["AWS", "Azure", "Serverless"],
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    name: "Lisa Rodriguez",
    role: "DevOps Specialist",
    skills: ["Kubernetes", "GitOps", "Terraform"],
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
  {
    name: "David Kim",
    role: "Full Stack Developer",
    skills: ["JavaScript", "Node.js", "React"],
    twitter: "#",
    github: "#",
    linkedin: "#",
  },
]

export default function MentorsPage() {
  return (
    <div className="container py-10">
      <div className="flex flex-col space-y-4 mb-10 text-center">
        <h1 className="text-4xl font-bold tracking-tighter sm:text-5xl md:text-6xl">Our Expert Mentors</h1>
        <p className="text-muted-foreground text-lg max-w-[800px] mx-auto">
          Learn from industry professionals passionate about sharing their knowledge and helping you grow.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mentors.map((mentor, index) => (
          <Card key={index} className="overflow-hidden group hover:shadow-lg transition-all duration-300">
            <CardHeader className="p-0">
              <div className="aspect-[4/3] relative overflow-hidden">
                <Image
                  src="https://hebbkx1anhila5yf.public.blob.vercel-storage.com/image-mqSImhcpQVcNR5qvCyOav9qYXJf6pl.png"
                  alt={mentor.name}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            </CardHeader>
            <CardContent className="p-4">
              <CardTitle className="text-xl mb-1 group-hover:text-primary transition-colors duration-300">
                {mentor.name}
              </CardTitle>
              <p className="text-sm text-muted-foreground mb-2">{mentor.role}</p>
              <div className="flex flex-wrap gap-2">
                {mentor.skills.map((skill, skillIndex) => (
                  <Badge key={skillIndex} variant="secondary" className="text-xs">
                    {skill}
                  </Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter className="p-4 pt-0 flex justify-between items-center">
              <div className="flex space-x-2">
                <Link
                  href={mentor.twitter}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Twitter className="h-4 w-4" />
                </Link>
                <Link
                  href={mentor.github}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Github className="h-4 w-4" />
                </Link>
                <Link
                  href={mentor.linkedin}
                  className="text-muted-foreground hover:text-primary transition-colors duration-200"
                >
                  <Linkedin className="h-4 w-4" />
                </Link>
              </div>
              <Button variant="ghost" size="sm" className="group-hover:text-primary transition-colors duration-300">
                View Profile <ArrowRight className="ml-1 h-3 w-3" />
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="mt-16 text-center">
        <h2 className="text-3xl font-bold mb-4">Want to Become a Mentor?</h2>
        <p className="text-muted-foreground text-lg mb-6 max-w-[600px] mx-auto">
          Share your expertise and help shape the next generation of tech professionals.
        </p>
        <Button size="lg" className="rounded-full">
          Apply to be a Mentor <ArrowRight className="ml-2 h-4 w-4" />
        </Button>
      </div>
    </div>
  )
}


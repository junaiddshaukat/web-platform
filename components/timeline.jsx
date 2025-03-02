import { ArrowRight } from "lucide-react"

const timelineEvents = [
  {
    year: "2020",
    title: "The Beginning",
    description:
      "Dev Weekends started as a small group of friends meeting on weekends to help each other with coding projects.",
  },
  {
    year: "2021",
    title: "First Official Sessions",
    description: "We organized our first structured mentorship sessions with 5 mentors and 25 participants.",
  },
  {
    year: "2022",
    title: "Expanding Our Reach",
    description:
      "Our community grew to over 500 members, and we introduced structured bootcamps to help learners upskill.",
  },
  {
    year: "2023",
    title: "Going Global",
    description:
      "We launched virtual mentorship sessions and expanded our reach to learners across multiple countries.",
  },
  {
    year: "2024",
    title: "Shaping the Future",
    description:
      "With thousands of active members and a thriving mentor network, Dev Weekends continues to empower the next generation of tech professionals.",
  },
]

export default function Timeline() {
  return (
    <div className="container mx-auto px-4 py-16">
      <section className="mb-16">
        <h2 className="text-4xl font-bold mb-12 text-center">Our Journey</h2>

        <div className="relative">
          {/* Vertical line */}
          <div className="absolute left-1/2 transform -translate-x-1/2 w-0.5 h-full bg-gray-200 dark:bg-gray-700"></div>

          {timelineEvents.map((event, index) => (
            <div key={index} className={`mb-16 flex items-center ${index % 2 === 0 ? "flex-row-reverse" : ""}`}>
              <div className={`w-1/2 ${index % 2 === 0 ? "pr-12 text-right" : "pl-12"}`}>
                <h3 className="text-3xl font-bold text-primary mb-2">{event.year}</h3>
                <h4 className="text-xl font-semibold mb-2">{event.title}</h4>
                <p className="text-gray-600 dark:text-gray-400">{event.description}</p>
              </div>
              <div className="w-10 h-10 absolute left-1/2 transform -translate-x-1/2 -translate-y-4 rounded-full border-4 border-white dark:border-gray-800 bg-primary flex items-center justify-center">
                <ArrowRight className="w-5 h-5 text-white" />
              </div>
            </div>
          ))}
        </div>
      </section>

    </div>
  )
}


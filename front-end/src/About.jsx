import { useEffect, useState } from 'react'
import axios from 'axios'
import './About.css'

const server = import.meta.env.VITE_SERVER_HOSTNAME

export default function About() {
  const [about, setAbout] = useState(null)
  const [error, setError] = useState(false)

  useEffect(() => {
    const controller = new AbortController()
    axios.get(`${server}/about`, { signal: controller.signal })
      .then(response => setAbout(response.data))
      .catch(() => {
        if (!controller.signal.aborted) setError(true)
      })
    return () => controller.abort()
  }, [])

  if (error) return <p role="alert">Unable to load this page. Please refresh to try again.</p>
  if (!about) return <p role="status">Loading...</p>

  return (
    <article className="About">
      <div className="About-copy">
        <p className="About-eyebrow">{about.eyebrow}</p>
        <h1>{about.title}</h1>
        <h2>{about.name}</h2>
        <p className="About-intro">{about.introduction}</p>
        <div className="About-bio">
          {about.paragraphs.map(paragraph => <p key={paragraph}>{paragraph}</p>)}
        </div>
        <h3>{about.interestsLabel}</h3>
        <ul className="About-interests">
          {about.interests.map(interest => <li key={interest}>{interest}</li>)}
        </ul>
      </div>
      <figure>
        <img src={new URL(about.image.url, server).href} alt={about.image.alt} />
        <figcaption>{about.image.caption}</figcaption>
      </figure>
    </article>
  )
}

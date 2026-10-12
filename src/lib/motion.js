import gsap from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'
import { SplitText } from 'gsap/SplitText'
import { DrawSVGPlugin } from 'gsap/DrawSVGPlugin'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(ScrollTrigger, SplitText, DrawSVGPlugin, useGSAP)

// Shared, mutable state read every frame by the 3D scene, cursor and gear widgets.
export const scrollState = { velocity: 0, progress: 0, direction: 1, heroProgress: 0 }

export const prefersReducedMotion =
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches

export let lenis = null
export const setLenis = (l) => (lenis = l)

export function scrollToTarget(target) {
  if (lenis) lenis.scrollTo(target, { offset: 0, duration: 1.6 })
  else document.querySelector(target)?.scrollIntoView({ behavior: 'smooth' })
}

export { gsap, ScrollTrigger, SplitText, useGSAP }

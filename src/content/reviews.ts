import type { Review } from "@/components/ReviewDeck";

// Customer reviews: the home page card deck and the About Us carousel.
// PLACEHOLDER CONTENT: these are sample reviews, not real customers. Replace
// them with genuine reviews (and only show a customer's photo, email and phone
// with their permission) before the site goes live. `photo` is optional,
// e.g. "/reviews/sarah.jpg" in public/reviews; initials are shown without it.
export const REVIEWS: Review[] = [
  {
    name: "Sarah Mitchell",
    email: "sarah.mitchell@example.com",
    phone: "+64 21 ••• 0142",
    text: "RF DATA helped us track pallets and crates across two coolstores. We now know where every load carrier is, and stocktakes take minutes instead of days.",
  },
  {
    name: "James Walker",
    email: "james.walker@example.com",
    phone: "+64 27 ••• 3318",
    text: "From the first consultation to installation, the team understood exactly what our production line needed. The readers and tags have worked flawlessly.",
  },
  {
    name: "Aroha Ngata",
    email: "aroha.ngata@example.com",
    phone: "+64 22 ••• 7765",
    text: "Finding medical equipment used to waste hours every week. With RFID asset tracking our staff can locate what they need straight away.",
  },
  {
    name: "Daniel Chen",
    email: "daniel.chen@example.com",
    phone: "+64 21 ••• 5094",
    text: "Our rental crates and roll cages kept going missing. RF DATA's solution gave us full visibility of our pool, and losses have dropped significantly.",
  },
  {
    name: "Emma Thompson",
    email: "emma.thompson@example.com",
    phone: "+64 29 ••• 2287",
    text: "Excellent support after go-live. Whenever we had a question, someone got back to us quickly and sorted it out. Highly recommended.",
  },
];

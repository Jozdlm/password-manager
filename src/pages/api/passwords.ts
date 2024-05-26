import type { APIRoute } from "astro";
import type { Password } from "../../lib/interfaces/password";

const passwords: Password[] = [
  {
    id: "1a2b3c4d5e",
    url: "https://example.com",
    username: "user1",
    password: "P@ssw0rd123",
    categoryId: "001",
    note: "Work email account",
    userId: "user001",
  },
  {
    id: "2b3c4d5e6f",
    url: "https://another-example.com",
    username: "user2",
    password: "An0therP@ss",
    categoryId: "002",
    note: "Personal blog login",
    userId: "user002",
  },
  {
    id: "3c4d5e6f7g",
    url: "https://somesite.com",
    username: "user3",
    password: "S0m3P@ssw0rd",
    categoryId: "003",
    note: "Banking account",
    userId: "user001",
  },
  {
    id: "4d5e6f7g8h",
    url: "https://yetanother.com",
    username: "user4",
    password: "Y3tAn0therP@ss",
    categoryId: "004",
    note: "Shopping site login",
    userId: "user003",
  },
  {
    id: "5e6f7g8h9i",
    url: "https://finalsite.com",
    username: "user5",
    password: "F1nalP@ss",
    categoryId: "005",
    note: "Social media account",
    userId: "user004",
  },
];

export const GET: APIRoute = () => {
  return new Response(JSON.stringify(passwords), {
    headers: {
      "Content-Type": "application/json",
    },
  });
};

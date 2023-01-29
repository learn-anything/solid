import styles from "./index.module.css"
import { type VoidComponent, Suspense } from "solid-js"
import { A, Head, Title, Meta, Link } from "solid-start"
import { trpc } from "~/utils/trpc"
import { signOut, signIn } from "@auth/solid-start/client"
import { createServerData$ } from "solid-start/server"
import { getSession } from "@auth/solid-start"
import { authOpts } from "./api/auth/[...solidauth]"

const Home: VoidComponent = () => {
  const hello = trpc.test.hello.useQuery(() => ({ name: "from tRPC" }))
  return (
    <>
      <Head>
        <Title>Learn Anything</Title>
        <Meta name="description" content="Generated by create-jd-app" />
        <Link rel="icon" href="/favicon.ico" />
      </Head>
      <main>
        <div class={styles.container}>
          <h1 class={styles.title}>
            Create <span class={styles.greenSpan}>JD</span> App
          </h1>
          <div class={styles.cardRow}>
            <A
              class={styles.card}
              href="https://start.solidjs.com"
              target="_blank"
            >
              <h3 class={styles.cardTitle}>Solid Start →</h3>
              <div class={styles.cardText}>
                Learn more about Solid Start and the basics.
              </div>
            </A>
            <A
              class={styles.card}
              href="https://github.com/orjdev/create-jd-app"
              target="_blank"
            >
              <h3 class={styles.cardTitle}>JD End →</h3>
              <div class={styles.cardText}>
                Learn more about Create JD App, the libraries it uses, and how
                to deploy it
              </div>
            </A>
          </div>
          <div class={styles.showcaseContainer}>
            <p class={styles.showcaseText}>
              {hello.data ?? "Loading tRPC query"}
            </p>
            <Suspense>
              <AuthShowcase />
            </Suspense>
          </div>
        </div>
      </main>
    </>
  )
}

export default Home

const AuthShowcase: VoidComponent = () => {
  const sessionData = createSession()
  return (
    <div class={styles.authContainer}>
      <p class={styles.showcaseText}>
        {sessionData() && <span>Logged in as {sessionData()?.user?.name}</span>}
      </p>
      <button
        class={styles.loginButton}
        onClick={
          sessionData() ? () => void signOut() : () => void signIn("github")
        }
      >
        {sessionData() ? "Sign out" : "Sign in"}
      </button>
    </div>
  )
}

const createSession = () => {
  return createServerData$(async (_, event) => {
    return await getSession(event.request, authOpts)
  })
}

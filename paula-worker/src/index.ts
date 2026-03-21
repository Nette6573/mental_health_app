import { runPaulaAI } from "./ai/paula";

export default {
  async fetch(request: Request, env: any): Promise<Response> {

    // ✅ Handle CORS
    if (request.method === "OPTIONS") {
      return new Response(null, {
        headers: {
          "Access-Control-Allow-Origin": "*",
          "Access-Control-Allow-Methods": "POST",
          "Access-Control-Allow-Headers": "Content-Type"
        }
      });
    }

    const url = new URL(request.url);

    // ✅ Chat route
    if (url.pathname === "/chat" && request.method === "POST") {
      try {
        const body = await request.json() as {
          message: string;
          sessionId?: string;
        };

        if (!body.message) {
          return new Response(JSON.stringify({ error: "Message is required" }), {
            status: 400
          });
        }

        const reply = await runPaulaAI(body.message, env, body.sessionId);

        return new Response(JSON.stringify({ reply }), {
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*"
          }
        });

      } catch (err: any) {
        return new Response(JSON.stringify({ error: err.message }), {
          status: 500
        });
      }
    }

    // ❌ Everything else = Not Found
    return new Response("Not Found", { status: 404 });
  }
};
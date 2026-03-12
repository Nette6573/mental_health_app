def _get_empathetic_response(
    self,
    user_message,
    conversation_history,
    max_tokens,
    temperature
):

    import os
    import requests

    account_id = os.getenv("CLOUDFLARE_ACCOUNT_ID")
    token = os.getenv("CLOUDFLARE_API_TOKEN")

    endpoint = f"https://api.cloudflare.com/client/v4/accounts/{account_id}/ai/run/@cf/meta/llama-3-8b-instruct"

    headers = {
        "Authorization": f"Bearer {token}",
        "Content-Type": "application/json"
    }

    messages = [
        {"role": "system", "content": self._system_prompt()}
    ]

    if conversation_history:
        for msg in conversation_history[-6:]:
            messages.append({
                "role": msg.get("role"),
                "content": msg.get("content", "")
            })

    messages.append({
        "role": "user",
        "content": user_message
    })

    payload = {
        "messages": messages,
        "max_tokens": max_tokens
    }

    try:
        response = requests.post(endpoint, headers=headers, json=payload)

        data = response.json()

        return data["result"]["response"]

    except Exception as e:
        print("Cloudflare AI error:", e)
        return self._fallback()
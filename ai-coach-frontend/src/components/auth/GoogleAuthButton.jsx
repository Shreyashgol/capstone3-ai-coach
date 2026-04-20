import React, { useEffect, useRef, useState } from "react";

const GOOGLE_SCRIPT_SRC = "https://accounts.google.com/gsi/client";

let googleScriptPromise;

function loadGoogleScript() {
  if (window.google?.accounts?.id) {
    return Promise.resolve();
  }

  if (googleScriptPromise) {
    return googleScriptPromise;
  }

  googleScriptPromise = new Promise((resolve, reject) => {
    const existingScript = document.querySelector(`script[src="${GOOGLE_SCRIPT_SRC}"]`);

    if (existingScript) {
      const timeoutId = window.setInterval(() => {
        if (window.google?.accounts?.id) {
          window.clearInterval(timeoutId);
          resolve();
        }
      }, 200);

      window.setTimeout(() => {
        window.clearInterval(timeoutId);
        reject(new Error("Google Identity Services failed to load"));
      }, 5000);

      return;
    }

    const script = document.createElement("script");
    script.src = GOOGLE_SCRIPT_SRC;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error("Google Identity Services failed to load"));
    document.head.appendChild(script);
  });

  return googleScriptPromise;
}

export default function GoogleAuthButton({ mode = "signin", loading = false, onCredential }) {
  const buttonRef = useRef(null);
  const onCredentialRef = useRef(onCredential);
  const [error, setError] = useState("");
  const [isReady, setIsReady] = useState(false);
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  useEffect(() => {
    onCredentialRef.current = onCredential;
  }, [onCredential]);

  useEffect(() => {
    let isCancelled = false;

    async function setupGoogleButton() {
      if (!clientId) {
        setError("Google OAuth is not configured yet.");
        return;
      }

      try {
        await loadGoogleScript();

        if (isCancelled || !buttonRef.current || !window.google?.accounts?.id) {
          return;
        }

        setError("");
        setIsReady(true);
        buttonRef.current.innerHTML = "";

        window.google.accounts.id.initialize({
          client_id: clientId,
          callback: async (response) => {
            if (!response?.credential) {
              setError("Google did not return a valid credential.");
              return;
            }

            await onCredentialRef.current(response.credential);
          }
        });

        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          shape: "pill",
          width: 360,
          text: mode === "signup" ? "signup_with" : "signin_with"
        });
      } catch (scriptError) {
        if (!isCancelled) {
          setError("Unable to load Google sign-in right now.");
        }
      }
    }

    setupGoogleButton();

    return () => {
      isCancelled = true;
    };
  }, [clientId, mode]);

  return (
    <div className="space-y-3">
      <div className="relative">
        <div
          ref={buttonRef}
          className="min-h-[44px] flex justify-center"
        />
        {loading && (
          <div className="absolute inset-0 rounded-full bg-background/70" />
        )}
      </div>

      {!isReady && !error && (
        <p className="text-center text-sm text-muted-foreground">
          Loading Google sign-in...
        </p>
      )}

      {error && (
        <p className="text-center text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}

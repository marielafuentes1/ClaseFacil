export function useToast() {
  return {
    toast: (props: { title: string; description?: string; variant?: string }) => {
      let message = `${props.title}`;
      if (props.description) message += `\n${props.description}`;
      if (props.variant === "destructive") message = "❌ " + message;
      alert(message);
    },
  };
}

import * as React from "react"

function Avatar({ className, children, ...props }: React.HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={"inline-block rounded-full overflow-hidden " + (className || "")} {...props}>
      {children}
    </div>
  )
}

function AvatarImage(props: React.ImgHTMLAttributes<HTMLImageElement>) {
  return <img className="w-full h-full object-cover" {...props} />
}

function AvatarFallback({ children, className }: { children?: React.ReactNode; className?: string }) {
  return (
    <div className={"inline-flex items-center justify-center rounded-full bg-gray-200 text-gray-600 " + (className || "") + " w-10 h-10"}>
      {children}
    </div>
  )
}

export { Avatar, AvatarImage, AvatarFallback }

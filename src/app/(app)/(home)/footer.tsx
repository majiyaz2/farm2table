export const Footer = () => {
    return (
        <footer className="flex border-t justify-between font-medium p-6">
            <div className="flex items-center gap-2">
                <p>© {new Date().getFullYear()} Farm2Table. All rights reserved.</p>
            </div>
        </footer>
    )
}
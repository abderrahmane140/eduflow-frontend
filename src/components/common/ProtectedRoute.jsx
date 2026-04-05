import { Navigate, replace } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import LoadingSpinner from "./LoadingSpinner";

export default function ProtectedRoute({children, role}){
    const {user, loading} = useAuth();

    if(loading) return <LoadingSpinner/>
    if(!user) return <Navigate to="/login" replace />

    if(role && user.role !== role) {
        return <Navigate to={
            user.role === 'teacher' ? '/teacher/dashboard' : '/student/dashboard'
        } replace />
    }

    return children;
}
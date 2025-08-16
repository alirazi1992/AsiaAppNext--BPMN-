
import LoginForm from "./../components/pages/form/LoginForm";
import LoginCarousel from "./../components/pages/carousel/carousel";

 const LoginPage = () => {
  return (
   <>
    <section style={{background : "#212e3a"}} className="flex justify-center">
      <LoginCarousel />
      <LoginForm />
    </section>
   </>
  )
}
export default LoginPage;
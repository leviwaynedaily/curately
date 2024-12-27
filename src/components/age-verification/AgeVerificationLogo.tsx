interface AgeVerificationLogoProps {
  logo?: string;
}

export const AgeVerificationLogo = ({ logo }: AgeVerificationLogoProps) => {
  if (!logo) return null;
  
  return (
    <div className="flex justify-center">
      <img 
        src={logo} 
        alt="Gallery Logo" 
        className="h-24 w-auto object-contain"
      />
    </div>
  );
};
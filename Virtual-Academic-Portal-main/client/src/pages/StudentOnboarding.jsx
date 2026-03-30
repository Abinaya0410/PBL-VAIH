
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function StudentOnboarding() {
  const navigate = useNavigate();

  const statesByCountry = {
    India: [
      "Andhra Pradesh","Arunachal Pradesh","Assam","Bihar","Chhattisgarh",
      "Goa","Gujarat","Haryana","Himachal Pradesh","Jharkhand",
      "Karnataka","Kerala","Madhya Pradesh","Maharashtra","Manipur",
      "Meghalaya","Mizoram","Nagaland","Odisha","Punjab",
      "Rajasthan","Sikkim","Tamil Nadu","Telangana","Tripura",
      "Uttar Pradesh","Uttarakhand","West Bengal",
      "Andaman and Nicobar Islands","Chandigarh",
      "Dadra and Nagar Haveli and Daman and Diu",
      "Delhi","Jammu and Kashmir","Ladakh","Lakshadweep","Puducherry"
    ],
    USA: [
      "Alabama","Alaska","Arizona","Arkansas","California","Colorado",
      "Connecticut","Delaware","Florida","Georgia","Hawaii","Idaho",
      "Illinois","Indiana","Iowa","Kansas","Kentucky","Louisiana",
      "Maine","Maryland","Massachusetts","Michigan","Minnesota",
      "Mississippi","Missouri","Montana","Nebraska","Nevada",
      "New Hampshire","New Jersey","New Mexico","New York",
      "North Carolina","North Dakota","Ohio","Oklahoma","Oregon",
      "Pennsylvania","Rhode Island","South Carolina","South Dakota",
      "Tennessee","Texas","Utah","Vermont","Virginia","Washington",
      "West Virginia","Wisconsin","Wyoming"
    ],
    UK: ["England","Scotland","Wales","Northern Ireland"]
  };

  const [formData, setFormData] = useState({
    collegeName: "",
    degree: "",
    department: "",
    year: "",
    interest: "",
    phone: "",
    country: "",
    state: "",
    city: "",
  });

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleCountryChange = (e) => {
    setFormData({
      ...formData,
      country: e.target.value,
      state: "",
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const email = localStorage.getItem("email");   // ⭐ IMPORTANT

      // await axios.post(
      //   "http://localhost:5000/api/users/complete-profile",
      //   { ...formData, email }   // ⭐ SEND EMAIL ALSO
      // );

      // navigate("/student");
      await axios.post(
  "http://localhost:5000/api/users/complete-profile",
  { ...formData, email }
);

// ⭐ SAVE PROFILE LOCALLY ALSO
localStorage.setItem(
  "studentProfile",
  JSON.stringify({
    name: localStorage.getItem("name") || "",
    email: email,
    collegeName: formData.collegeName,
    degree: formData.degree,
    department: formData.department,
    year: formData.year,
    interest: formData.interest,
    phone: formData.phone,
    country: formData.country,
    state: formData.state,
    city: formData.city
  })
);

navigate("/student-dashboard");

    } catch (err) {
      console.error(err);
      alert("Failed to save profile");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded-xl shadow-md w-[520px]">
        <h2 className="text-2xl font-bold mb-6 text-center">
          Complete Student Profile
        </h2>

        <form className="space-y-3" onSubmit={handleSubmit}>
          <input name="collegeName" placeholder="College Name" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="degree" placeholder="Degree" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="department" placeholder="Department" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="year" placeholder="Year" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="interest" placeholder="Area of Interest" className="w-full border p-2 rounded" onChange={handleChange} required />
          <input name="phone" placeholder="Phone Number" className="w-full border p-2 rounded" onChange={handleChange} required />

          <select name="country" className="w-full border p-2 rounded" value={formData.country} onChange={handleCountryChange} required>
            <option value="">Select Country</option>
            <option value="India">India</option>
            <option value="USA">USA</option>
            <option value="UK">UK</option>
          </select>

          {formData.country && (
            <select name="state" className="w-full border p-2 rounded" value={formData.state} onChange={handleChange} required>
              <option value="">Select State</option>
              {statesByCountry[formData.country].map((state) => (
                <option key={state} value={state}>{state}</option>
              ))}
            </select>
          )}

          <input name="city" placeholder="City" className="w-full border p-2 rounded" onChange={handleChange} required />

          <button className="w-full bg-blue-600 text-white p-2 rounded mt-3">
            Save & Continue
          </button>
        </form>
      </div>
    </div>
  );
}

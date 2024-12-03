<template>
    <div class="about-us-container">
        <h1>About Us</h1>
        <p class="intro">We are a group of three chill guys passionate about anime, Japanese culture, and web programming. Together, we’ve built this platform to share our love for learning Japanese!</p>
        <div class="team">
            <div class="team-member styledDiv-pretty" v-for="(member, index) in teamMembers" :key="index">
                <div class="member-image" :style="{ backgroundImage: `url(${member.image})` }">
                    <div class="hover-description">
                        <p>{{ member.description }}</p>
                    </div>
                </div>
                <h3>{{ member.name }}</h3>
                <div class="social-icons">
                    <a :href="`https://wa.me/${member.number}`" target="_blank"><img src="@/assets/icons/whatsapp.png" alt="Whatsapp"></a>
                    <a :href="`mailto:${member.tp_nb}@mail.apu.edu.my`" target="_blank"><img src="@/assets/icons/email.png" alt="Email"></a>
                    <a :href="`https://www.linkedin.com/in/${member.linkedin}`" target="_blank"><img src="@/assets/icons/linkedin.png" alt="LinkedIn"></a>
                </div>
            </div>
        </div>
    </div>
</template>


<script>
export default {
  name: 'AboutUs',
  data() {
    return {
      teamMembers: [
        {
          name: 'Fares DARGHOUTH',
          image: require('@/assets/team/fares.png'), // Replace with the actual image path
          description: 'Authentication page and backend functions associated to it including passwords requirements, avatar generation, interactive Alphabet page, Landing page, and Profile page to track progress, and modify personal information',
          number: '330695518031',
          tp_nb: 'tp083561',
          linkedin: 'fares-darghouth-321079252/',
        },
        {
          name: 'Louise MONCIERO',
          image: require('@/assets/team/louise.png'), // Replace with the actual image path
          description: 'Functionalities to edit a created quiz, the quiz page including UI & UX, management of routing links to allow fluid navigation between pages.',
          number: '330772262418',
          tp_nb: 'tp083380',
          linkedin: 'louise-monciero-598049252/',
        },
        {
          name: 'Valentin GOURJON',
          image: require('@/assets/team/valentin.png'), // Replace with the actual image path
          description: "Functionalities to create a quiz, fetch Jisho (dictionnary) API and display the results, locally store user's creditential, displaying quizzes with leaderboard, and administrative panel",
          number: '330627660541',
          tp_nb: 'tp083370',
          linkedin: 'valentin-gourjon-99b075252/',
        },
      ],
    };
  },
};
</script>

<style>
    .about-us-container {
        padding: 2rem;
        text-align: center;
        color: #333;
    }

    h1 {
        font-size: 2.5rem;
        margin-bottom: 1rem;
    }

    .intro {
        font-size: 1.2rem;
        margin-bottom: 2rem;
        max-width: 600px;
        margin-left: auto;
        margin-right: auto;
    }

    .team {
        display: flex;
        justify-content: center;
        flex-wrap: wrap;
        gap: 0.75rem;
    }

    .team-member {
        width: 250px;
        text-align: center;
    }

    .member-image {
        width: 100%;
        height: 250px;
        background-size: cover;
        background-position: center;
        border-radius: 8px;
        overflow: hidden;
        position: relative;
        transition: transform 0.3s ease;
    }

    .member-image:hover {
        transform: scale(1.05);
    }

    .hover-description {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.35);
        border-radius: 125px;
        color: #fff;
        display: flex;
        justify-content: center;
        align-items: center;
        opacity: 0;
        transition: opacity 0.3s ease;
        /* font-size: 15px; */
    }

    .member-image:hover .hover-description {
        opacity: 1;
    }

    h3 {
        margin-top: 1rem;
        font-size: 1.2rem;
        color: #333;
    }

    .social-icons {
        display: flex;
        justify-content: center;
        gap: 10px;
    }

    .social-icons a img {
        width: 30px;
        height: 30px;
        transition: all 150ms;
    }

    .social-icons a img:hover {
        transform: scale(1.2);
    }
</style>
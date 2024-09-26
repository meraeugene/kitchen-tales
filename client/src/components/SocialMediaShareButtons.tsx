interface SocialMediaShareButtonsProps {
  url: string;
  title: string;
}

const SocialMediaShareButtons = ({
  url,
  title,
}: SocialMediaShareButtonsProps) => {
  return (
    <div className="social-media__container flex gap-3">
      <a
        href={`https://www.facebook.com/dialog/share?app_id=${import.meta.env.VITE_FACEBOOK_APP_ID}&display=popup&href=${url}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border p-2"
      >
        <img
          src="/images/socials/fb.svg"
          alt="fb"
          className="h-[25px] w-[25px] object-cover"
          loading="lazy"
        />
      </a>

      <a
        href={`https://twitter.com/intent/tweet?url=${url}&text=${title}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border p-2"
      >
        <img
          src="/images/socials/twitter.svg"
          alt="fb"
          className="h-[25px] w-[25px] object-cover"
          loading="lazy"
        />
      </a>

      <a
        href={`https://mail.google.com/mail/?view=cm&su=${title}&body=${url}`}
        target="_blank"
        rel="noreferrer"
        className="rounded-full border p-2"
      >
        <img
          src="/images/socials/gmail.svg"
          alt="fb"
          className="h-[25px] w-[25px] object-cover"
          loading="lazy"
        />{" "}
      </a>
    </div>
  );
};

export default SocialMediaShareButtons;

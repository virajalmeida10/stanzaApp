package com.almeida.viraj01.projects.stanzaApp.service;

import com.almeida.viraj01.projects.stanzaApp.entity.Booking;
import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

import java.time.format.DateTimeFormatter;

@Service
@RequiredArgsConstructor
@Slf4j
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${mail.from}")
    private String fromEmail;

    // Never let an email failure break the booking confirmation / webhook.
    public void sendBookingConfirmation(Booking booking) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, "UTF-8");
            helper.setTo(booking.getUser().getEmail());
            helper.setFrom(fromEmail);
            helper.setSubject("Your Stanza booking is confirmed — Booking #" + booking.getId());
            helper.setText(buildHtml(booking), true);
            mailSender.send(message);
            log.info("Confirmation email sent for booking {} to {}", booking.getId(), booking.getUser().getEmail());
        } catch (Exception e) {
            log.error("Could not send confirmation email for booking {}: {}", booking.getId(), e.getMessage());
        }
    }

    private String buildHtml(Booking b) {
        DateTimeFormatter fmt = DateTimeFormatter.ofPattern("EEE, dd MMM yyyy");
        String guestName = b.getUser().getName() != null ? b.getUser().getName() : "Guest";
        return """
            <div style="font-family:Arial,Helvetica,sans-serif;max-width:600px;margin:auto;border:1px solid #e2e8f0;border-radius:12px;overflow:hidden">
              <div style="background:#4f46e5;color:#ffffff;padding:24px">
                <h1 style="margin:0;font-size:22px">Booking confirmed</h1>
                <p style="margin:6px 0 0;opacity:0.9">Thank you, %s. Your stay is booked and paid.</p>
              </div>
              <div style="padding:24px;color:#0f172a">
                <p style="font-size:16px;margin:0 0 16px"><b>%s</b><br><span style="color:#64748b">%s</span></p>
                <table style="width:100%%;border-collapse:collapse;font-size:14px">
                  <tr><td style="padding:8px 0;color:#64748b">Room</td><td style="padding:8px 0;text-align:right;color:#0f172a">%s</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b">Check-in</td><td style="padding:8px 0;text-align:right;color:#0f172a">%s</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b">Check-out</td><td style="padding:8px 0;text-align:right;color:#0f172a">%s</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b">Rooms</td><td style="padding:8px 0;text-align:right;color:#0f172a">%d</td></tr>
                  <tr><td style="padding:8px 0;color:#64748b">Booking ID</td><td style="padding:8px 0;text-align:right;color:#0f172a">#%d</td></tr>
                  <tr><td style="padding:14px 0 0;border-top:1px solid #e2e8f0;color:#64748b">Total paid</td>
                      <td style="padding:14px 0 0;border-top:1px solid #e2e8f0;text-align:right;font-size:18px;font-weight:bold;color:#0f172a">$%s</td></tr>
                </table>
                <p style="color:#94a3b8;font-size:12px;margin-top:24px">Booked via Stanza. Need help? Just reply to this email.</p>
              </div>
            </div>
            """.formatted(
                guestName,
                b.getHotel().getName(),
                b.getHotel().getCity(),
                b.getRoom().getType(),
                b.getCheckInDate().format(fmt),
                b.getCheckOutDate().format(fmt),
                b.getRoomsCount(),
                b.getId(),
                b.getAmount().toPlainString()
        );
    }
}
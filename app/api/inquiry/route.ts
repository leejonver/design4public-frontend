import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { Resend } from "resend";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;
const resendApiKey = process.env.RESEND_API_KEY;

export async function POST(request: NextRequest) {
    try {
        const body = await request.json();
        const { name, email, phone, company, project_slug, message } = body;

        // Validation
        if (!name || !email || !message) {
            return NextResponse.json(
                { error: "이름, 이메일, 문의 내용은 필수 항목입니다." },
                { status: 400 }
            );
        }

        // Email validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json(
                { error: "올바른 이메일 주소를 입력해주세요." },
                { status: 400 }
            );
        }

        // Create Supabase client
        const supabase = createClient(supabaseUrl, supabaseAnonKey);

        // Insert inquiry into database
        const { error: dbError } = await supabase.from("inquiries").insert([
            {
                name,
                email,
                phone: phone || null,
                company: company || null,
                project_slug: project_slug || null,
                message,
                status: "pending",
            },
        ]);

        if (dbError) {
            console.error("Database error:", dbError);
            return NextResponse.json(
                { error: "문의 저장에 실패했습니다. 다시 시도해주세요." },
                { status: 500 }
            );
        }

        // Send email notification using Resend
        if (resendApiKey) {
            try {
                const resend = new Resend(resendApiKey);

                const projectInfo = project_slug
                    ? `<tr><td style="padding: 8px 0; color: #666;">관련 프로젝트:</td><td style="padding: 8px 0;"><a href="https://design4public.com/projects/${project_slug}" style="color: #4a7c59;">${project_slug}</a></td></tr>`
                    : '';

                await resend.emails.send({
                    from: "Design4Public <noreply@design4public.com>",
                    to: ["d4p@design4public.com"],
                    replyTo: email,
                    subject: `[D4P 문의] ${name}님의 새로운 문의가 도착했습니다`,
                    html: `
                        <!DOCTYPE html>
                        <html>
                        <head>
                            <meta charset="utf-8">
                            <title>새로운 문의</title>
                        </head>
                        <body style="font-family: 'Apple SD Gothic Neo', 'Malgun Gothic', sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
                            <div style="background: linear-gradient(135deg, #4a7c59 0%, #6b9b7a 100%); padding: 30px; border-radius: 12px 12px 0 0;">
                                <h1 style="color: white; margin: 0; font-size: 24px;">📬 새로운 문의가 도착했습니다</h1>
                            </div>
                            <div style="background: #f9fafb; padding: 30px; border: 1px solid #e5e7eb; border-top: none; border-radius: 0 0 12px 12px;">
                                <table style="width: 100%; border-collapse: collapse;">
                                    <tr><td style="padding: 8px 0; color: #666; width: 100px;">이름:</td><td style="padding: 8px 0; font-weight: 600;">${name}</td></tr>
                                    <tr><td style="padding: 8px 0; color: #666;">이메일:</td><td style="padding: 8px 0;"><a href="mailto:${email}" style="color: #4a7c59;">${email}</a></td></tr>
                                    ${phone ? `<tr><td style="padding: 8px 0; color: #666;">연락처:</td><td style="padding: 8px 0;">${phone}</td></tr>` : ''}
                                    ${company ? `<tr><td style="padding: 8px 0; color: #666;">회사/기관:</td><td style="padding: 8px 0;">${company}</td></tr>` : ''}
                                    ${projectInfo}
                                </table>
                                <div style="margin-top: 20px; padding: 20px; background: white; border-radius: 8px; border: 1px solid #e5e7eb;">
                                    <h3 style="margin: 0 0 12px 0; color: #4a7c59; font-size: 14px;">문의 내용</h3>
                                    <p style="margin: 0; white-space: pre-wrap;">${message}</p>
                                </div>
                                <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e5e7eb; font-size: 12px; color: #666;">
                                    <p style="margin: 0;">이 이메일은 Design4Public 웹사이트의 문의 폼을 통해 자동으로 발송되었습니다.</p>
                                    <p style="margin: 8px 0 0 0;">답장하기: 이 이메일에 바로 답장하시면 ${email}로 전송됩니다.</p>
                                </div>
                            </div>
                        </body>
                        </html>
                    `,
                });

                console.log("Email notification sent successfully");
            } catch (emailError) {
                // Log email error but don't fail the request since DB save succeeded
                console.error("Email send error:", emailError);
            }
        } else {
            // Log inquiry details when Resend is not configured
            console.log("New inquiry received (email not configured):", {
                name,
                email,
                phone,
                company,
                project_slug,
                message: message.substring(0, 100) + "...",
            });
        }

        return NextResponse.json({ success: true });
    } catch (error) {
        console.error("Inquiry API error:", error);
        return NextResponse.json(
            { error: "서버 오류가 발생했습니다. 다시 시도해주세요." },
            { status: 500 }
        );
    }
}

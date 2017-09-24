; Uses S-C Assembler variant.
* This is also a valid comment...
            org $800
main        ldy #$00
start_loop  lda HelloWorld,y
            beq end_loop 
            jsr $fded ; ROM routine, COUT, y is preserved
            iny
            bne start_loop
end_loop    rts
HelloWorld	ASC "HELLO WORLD!"00
